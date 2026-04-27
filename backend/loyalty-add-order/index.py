import json
import os
import smtplib
import psycopg2
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}
SCHEMA = os.environ['MAIN_DB_SCHEMA']
BONUS_FIRST_ORDER = 200


def send_email(name, phone, address, comment, items, total_price, order_id):
    smtp_user = 'filini_ufa@mail.ru'
    smtp_password = os.environ['SMTP_PASSWORD']

    items_html = ''.join([
        f"<tr><td style='padding:4px 8px;'>{i.get('name', '')}</td><td style='padding:4px 8px;'>{i.get('quantity', 1)} шт.</td><td style='padding:4px 8px;'>{i.get('price', 0)} ₽</td></tr>"
        for i in items
    ])

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 560px; padding: 24px; background: #f9f9f9; border-radius: 12px;">
        <h2 style="color: #1a6b3c;">🥬 Новый заказ #{order_id}</h2>
        <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:6px 0; color:#666; width:130px;">Имя:</td><td style="font-weight:bold;">{name}</td></tr>
            <tr><td style="padding:6px 0; color:#666;">Телефон:</td><td><a href="tel:{phone}" style="color:#1a6b3c;">{phone}</a></td></tr>
            <tr><td style="padding:6px 0; color:#666;">Адрес:</td><td>{address or '—'}</td></tr>
            {"<tr><td style='padding:6px 0; color:#666;'>Комментарий:</td><td>" + comment + "</td></tr>" if comment else ""}
        </table>
        <h3 style="color:#1a6b3c; margin-top:20px;">Состав заказа:</h3>
        <table style="width:100%; border-collapse:collapse; background:#fff; border-radius:8px;">
            <tr style="background:#e8f5e9;"><th style="padding:6px 8px; text-align:left;">Товар</th><th style="padding:6px 8px;">Кол-во</th><th style="padding:6px 8px;">Цена</th></tr>
            {items_html}
            <tr style="border-top:2px solid #e8f5e9;"><td colspan="2" style="padding:8px; font-weight:bold;">Итого:</td><td style="padding:8px; font-weight:bold; color:#1a6b3c;">{total_price} ₽</td></tr>
        </table>
        <p style="margin-top:20px; color:#999; font-size:12px;">Заказ с сайта ОвощиМаркет</p>
    </div>
    """

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новый заказ #{order_id} — {name} — {total_price} ₽'
    msg['From'] = smtp_user
    msg['To'] = smtp_user
    msg.attach(MIMEText(html, 'html'))

    with smtplib.SMTP_SSL('smtp.mail.ru', 465) as server:
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, smtp_user, msg.as_string())


def calc_monthly_bonus(total: float) -> int:
    """Рассчитывает % кэшбэка: 1% до 10000, 3% до 20000, 10% до 2000000"""
    if total <= 0:
        return 0
    elif total <= 10000:
        return int(total * 0.01)
    elif total <= 20000:
        return int(total * 0.03)
    else:
        return int(min(total, 2000000) * 0.10)


def handler(event: dict, context) -> dict:
    """Оформление заказа (POST), история заказов (GET), ежемесячный кэшбэк (POST ?action=monthly_bonus)"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    params = event.get('queryStringParameters') or {}

    # --- Ежемесячное начисление баллов ---
    if event.get('httpMethod') == 'POST' and params.get('action') == 'monthly_bonus':
        secret = params.get('secret', '')
        if secret != os.environ.get('CRON_SECRET', ''):
            return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Forbidden'})}

        from datetime import datetime, timezone
        now = datetime.now(timezone.utc)
        # Предыдущий месяц
        if now.month == 1:
            prev_year, prev_month = now.year - 1, 12
        else:
            prev_year, prev_month = now.year, now.month - 1

        period_start = f"{prev_year}-{prev_month:02d}-01"
        period_end = f"{now.year}-{now.month:02d}-01"
        period_label = f"{prev_year}-{prev_month:02d}"

        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()

        # Суммы заказов за предыдущий месяц по каждому пользователю
        cur.execute(
            f"""SELECT user_id, SUM(total_price)
                FROM {SCHEMA}.orders
                WHERE user_id IS NOT NULL
                  AND created_at >= %s AND created_at < %s
                GROUP BY user_id""",
            (period_start, period_end)
        )
        rows = cur.fetchall()

        processed = 0
        for user_id, total_sum in rows:
            bonus = calc_monthly_bonus(float(total_sum))
            if bonus <= 0:
                continue
            # Проверяем, не начисляли ли уже за этот период
            cur.execute(
                f"SELECT id FROM {SCHEMA}.loyalty_transactions WHERE user_id=%s AND reason=%s",
                (user_id, f'Кэшбэк за {period_label}')
            )
            if cur.fetchone():
                continue
            cur.execute(
                f"UPDATE {SCHEMA}.users SET points = points + %s WHERE id = %s",
                (bonus, user_id)
            )
            cur.execute(
                f"INSERT INTO {SCHEMA}.loyalty_transactions (user_id, points, reason) VALUES (%s, %s, %s)",
                (user_id, bonus, f'Кэшбэк за {period_label}')
            )
            processed += 1

        conn.commit()
        cur.close()
        conn.close()

        return {
            'statusCode': 200, 'headers': CORS,
            'body': json.dumps({'ok': True, 'period': period_label, 'users_credited': processed})
        }

    if event.get('httpMethod') == 'GET':
        params = event.get('queryStringParameters') or {}
        user_id = params.get('user_id')
        if not user_id:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'user_id обязателен'})}
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, address, comment, items, total_price, status, created_at FROM {SCHEMA}.orders WHERE user_id=%s ORDER BY created_at DESC LIMIT 50",
            (user_id,)
        )
        order_rows = cur.fetchall()
        cur.execute(
            f"SELECT id, points, reason, created_at FROM {SCHEMA}.loyalty_transactions WHERE user_id=%s ORDER BY created_at DESC LIMIT 50",
            (user_id,)
        )
        tx_rows = cur.fetchall()
        cur.close()
        conn.close()
        orders = []
        for row in order_rows:
            orders.append({
                'id': row[0],
                'address': row[1],
                'comment': row[2],
                'items': row[3] if row[3] else [],
                'total_price': float(row[4]),
                'status': row[5],
                'created_at': row[6].isoformat(),
            })
        transactions = []
        for row in tx_rows:
            transactions.append({
                'id': row[0],
                'points': row[1],
                'reason': row[2],
                'created_at': row[3].isoformat(),
            })
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'orders': orders, 'transactions': transactions}, ensure_ascii=False)}

    body = json.loads(event.get('body') or '{}')
    user_id = body.get('user_id')
    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()
    address = body.get('address', '').strip()
    comment = body.get('comment', '').strip()
    items = body.get('items', [])
    total_price = body.get('total_price', 0)
    points_used = int(body.get('points_used', 0))

    if not name or not phone:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Имя и телефон обязательны'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(
        f"INSERT INTO {SCHEMA}.orders (user_id, name, phone, address, comment, items, total_price) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
        (user_id, name, phone, address, comment, json.dumps(items), total_price)
    )
    order_id = cur.fetchone()[0]

    bonus = 0
    points = 0
    is_first_order_done = False

    if user_id:
        cur.execute(f"SELECT points, is_first_order_done FROM {SCHEMA}.users WHERE id=%s", (user_id,))
        user_row = cur.fetchone()
        if user_row:
            points, is_first_order_done = user_row

            if points_used > 0:
                actual_used = min(points_used, points)
                points = points - actual_used
                cur.execute(
                    f"INSERT INTO {SCHEMA}.loyalty_transactions (user_id, points, reason) VALUES (%s, %s, %s)",
                    (user_id, -actual_used, f'Списание баллов за заказ #{order_id}')
                )

            if not is_first_order_done:
                bonus = BONUS_FIRST_ORDER
                points = points + bonus
                is_first_order_done = True
                cur.execute(
                    f"INSERT INTO {SCHEMA}.loyalty_transactions (user_id, points, reason) VALUES (%s, %s, %s)",
                    (user_id, bonus, 'Бонус за первый заказ')
                )

            cur.execute(
                f"UPDATE {SCHEMA}.users SET points=%s, is_first_order_done=%s WHERE id=%s",
                (points, is_first_order_done, user_id)
            )

    conn.commit()
    cur.close()
    conn.close()

    send_email(name, phone, address, comment, items, total_price, order_id)

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({'ok': True, 'order_id': order_id, 'bonus': bonus, 'points': points, 'is_first_order_done': is_first_order_done})
    }