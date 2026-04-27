import json
import os
import smtplib
import psycopg2
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}
SCHEMA = os.environ['MAIN_DB_SCHEMA']
BONUS_FIRST_ORDER = 200


def send_email(name, phone, address, comment, items, total_price, order_id):
    smtp_user = 'filimono_86@mail.ru'
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


def handler(event: dict, context) -> dict:
    """Оформление заказа: сохранение в БД, начисление бонусов, отправка письма"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    user_id = body.get('user_id')
    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()
    address = body.get('address', '').strip()
    comment = body.get('comment', '').strip()
    items = body.get('items', [])
    total_price = body.get('total_price', 0)

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

    if user_id:
        cur.execute(f"SELECT points, is_first_order_done FROM {SCHEMA}.users WHERE id=%s", (user_id,))
        user = cur.fetchone()
        if user:
            points, is_first_order_done = user
            if not is_first_order_done:
                bonus = BONUS_FIRST_ORDER
                points = points + bonus
                cur.execute(
                    f"UPDATE {SCHEMA}.users SET points=%s, is_first_order_done=TRUE WHERE id=%s",
                    (points, user_id)
                )
                cur.execute(
                    f"INSERT INTO {SCHEMA}.loyalty_transactions (user_id, points, reason) VALUES (%s, %s, %s)",
                    (user_id, bonus, 'Бонус за первый заказ')
                )

    conn.commit()
    cur.close()
    conn.close()

    send_email(name, phone, address, comment, items, total_price, order_id)

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({'ok': True, 'order_id': order_id, 'bonus': bonus, 'points': points})
    }
