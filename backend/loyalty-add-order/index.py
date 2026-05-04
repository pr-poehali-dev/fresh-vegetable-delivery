import json
import os
import smtplib
import psycopg2
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
}
VALID_STATUSES = ['new', 'processing', 'delivering', 'done', 'cancelled']
SCHEMA = os.environ['MAIN_DB_SCHEMA']
BONUS_FIRST_ORDER = 200
AVATARS = ['👨', '👩', '👨‍💼', '👩‍💼', '👨‍🦰', '👩‍🦰', '👴', '👵', '🧑', '👤']


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
    """Оформление заказа (POST), история заказов (GET), ежемесячный кэшбэк, каталог оверрайды (resource=catalog)."""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    params = event.get('queryStringParameters') or {}
    headers = event.get('headers') or {}
    admin_key = headers.get('X-Admin-Key', '')
    is_admin = admin_key == os.environ.get('ADMIN_KEY', 'unset')
    resource = params.get('resource', '')

    # === ОТЗЫВЫ ===
    if resource == 'reviews':
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        method = event.get('httpMethod')
        if method == 'GET':
            if is_admin:
                cur.execute(f"SELECT id, name, city, text, rating, avatar, approved, created_at FROM {SCHEMA}.reviews ORDER BY created_at DESC LIMIT 200")
            else:
                cur.execute(f"SELECT id, name, city, text, rating, avatar, approved, created_at FROM {SCHEMA}.reviews WHERE approved=TRUE ORDER BY created_at DESC LIMIT 50")
            rows = cur.fetchall()
            cur.close(); conn.close()
            reviews = [{'id': r[0], 'name': r[1], 'city': r[2], 'text': r[3], 'rating': r[4], 'avatar': r[5], 'approved': r[6], 'created_at': r[7].isoformat()} for r in rows]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'reviews': reviews}, ensure_ascii=False)}
        if method == 'POST':
            body = json.loads(event.get('body') or '{}')
            name = (body.get('name') or '').strip()
            city = (body.get('city') or 'Уфа').strip()
            text = (body.get('text') or '').strip()
            rating = max(1, min(5, int(body.get('rating') or 5)))
            if not name or not text:
                cur.close(); conn.close()
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'name и text обязательны'})}
            import random
            avatar = random.choice(AVATARS)
            approved = is_admin
            cur.execute(f"INSERT INTO {SCHEMA}.reviews (name, city, text, rating, avatar, approved) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id", (name, city, text, rating, avatar, approved))
            new_id = cur.fetchone()[0]
            conn.commit(); cur.close(); conn.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'id': new_id, 'approved': approved}, ensure_ascii=False)}
        if method == 'PUT':
            if not is_admin:
                cur.close(); conn.close()
                return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Forbidden'})}
            body = json.loads(event.get('body') or '{}')
            review_id = body.get('id')
            if not review_id:
                cur.close(); conn.close()
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'id обязателен'})}
            fields, vals = [], []
            for f in ['name', 'city', 'text', 'rating', 'avatar', 'approved']:
                if f in body:
                    fields.append(f"{f}=%s"); vals.append(body[f])
            vals.append(review_id)
            cur.execute(f"UPDATE {SCHEMA}.reviews SET {', '.join(fields)} WHERE id=%s", vals)
            conn.commit(); cur.close(); conn.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}
        if method == 'DELETE':
            if not is_admin:
                cur.close(); conn.close()
                return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Forbidden'})}
            body = json.loads(event.get('body') or '{}')
            review_id = body.get('id')
            cur.execute(f"DELETE FROM {SCHEMA}.reviews WHERE id=%s", (review_id,))
            conn.commit(); cur.close(); conn.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}
        cur.close(); conn.close()
        return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Method not allowed'})}

    # === КАТАЛОГ (оверрайды) ===
    if resource == 'catalog':
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        method = event.get('httpMethod')
        if method == 'GET':
            cur.execute(f"SELECT product_id, price, unit, badge, image, type, weight, weight_kg, hidden, name FROM {SCHEMA}.catalog_overrides")
            rows = cur.fetchall()
            cur.close(); conn.close()
            overrides = [{'product_id': r[0], 'price': r[1], 'unit': r[2], 'badge': r[3], 'image': r[4], 'type': r[5], 'weight': r[6], 'weight_kg': float(r[7]) if r[7] is not None else None, 'hidden': r[8], 'name': r[9]} for r in rows]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'overrides': overrides}, ensure_ascii=False)}
        if method == 'PUT':
            if not is_admin:
                cur.close(); conn.close()
                return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Forbidden'})}
            body = json.loads(event.get('body') or '{}')
            pid = body.get('product_id')
            if not pid:
                cur.close(); conn.close()
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'product_id обязателен'})}
            price = body.get('price')
            unit = body.get('unit')
            badge = body.get('badge')
            image = body.get('image')
            ptype = body.get('type')
            weight = body.get('weight')
            weight_kg = body.get('weight_kg')
            hidden = body.get('hidden', False)
            name = body.get('name') or None
            cur.execute(
                f"""INSERT INTO {SCHEMA}.catalog_overrides (product_id, price, unit, badge, image, type, weight, weight_kg, hidden, name, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                    ON CONFLICT (product_id) DO UPDATE SET
                        price=EXCLUDED.price, unit=EXCLUDED.unit, badge=EXCLUDED.badge,
                        image=EXCLUDED.image, type=EXCLUDED.type, weight=EXCLUDED.weight,
                        weight_kg=EXCLUDED.weight_kg, hidden=EXCLUDED.hidden, name=EXCLUDED.name, updated_at=NOW()""",
                (pid, price, unit, badge, image, ptype, weight, weight_kg, hidden, name)
            )
            conn.commit(); cur.close(); conn.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}
        cur.close(); conn.close()
        return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Method not allowed'})}

    # === ПОЛЬЗОВАТЕЛИ (только admin) ===
    if resource == 'users':
        if not is_admin:
            return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Forbidden'})}
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        method = event.get('httpMethod')
        if method == 'GET':
            cur.execute(f"""SELECT u.id, u.phone, u.name, u.points, u.is_first_order_done, u.created_at, u.last_seen_at, COUNT(o.id) as order_count
                FROM {SCHEMA}.users u LEFT JOIN {SCHEMA}.orders o ON o.user_id = u.id
                GROUP BY u.id ORDER BY u.last_seen_at DESC NULLS LAST, u.created_at DESC LIMIT 500""")
            rows = cur.fetchall()
            cur.close(); conn.close()
            users = [{'id': r[0], 'phone': r[1], 'name': r[2], 'points': r[3], 'is_first_order_done': r[4],
                      'created_at': r[5].isoformat() if r[5] else None, 'last_seen_at': r[6].isoformat() if r[6] else None, 'order_count': r[7]} for r in rows]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'users': users}, ensure_ascii=False)}
        if method == 'PUT':
            body = json.loads(event.get('body') or '{}')
            user_id = body.get('id')
            if not user_id:
                cur.close(); conn.close()
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'id обязателен'})}
            fields, vals = [], []
            if 'name' in body: fields.append("name=%s"); vals.append(body['name'])
            if 'phone' in body: fields.append("phone=%s"); vals.append(body['phone'])
            if 'is_first_order_done' in body: fields.append("is_first_order_done=%s"); vals.append(bool(body['is_first_order_done']))
            if 'points' in body:
                new_pts = int(body['points'])
                cur.execute(f"SELECT points FROM {SCHEMA}.users WHERE id=%s", (user_id,))
                old = cur.fetchone()
                if old:
                    diff = new_pts - old[0]
                    if diff != 0:
                        cur.execute(f"INSERT INTO {SCHEMA}.loyalty_transactions (user_id, points, reason) VALUES (%s, %s, %s)", (user_id, diff, body.get('points_reason') or 'Корректировка баллов администратором'))
                fields.append("points=%s"); vals.append(new_pts)
            if not fields:
                cur.close(); conn.close()
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Нет полей'})}
            vals.append(user_id)
            cur.execute(f"UPDATE {SCHEMA}.users SET {', '.join(fields)} WHERE id=%s", vals)
            conn.commit(); cur.close(); conn.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}
        if method == 'DELETE':
            body = json.loads(event.get('body') or '{}')
            user_id = body.get('id')
            if not user_id:
                cur.close(); conn.close()
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'id обязателен'})}
            cur.execute(f"DELETE FROM {SCHEMA}.loyalty_transactions WHERE user_id=%s", (user_id,))
            cur.execute(f"UPDATE {SCHEMA}.orders SET user_id=NULL WHERE user_id=%s", (user_id,))
            cur.execute(f"DELETE FROM {SCHEMA}.sms_codes WHERE phone=(SELECT phone FROM {SCHEMA}.users WHERE id=%s)", (user_id,))
            cur.execute(f"DELETE FROM {SCHEMA}.users WHERE id=%s", (user_id,))
            conn.commit(); cur.close(); conn.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}
        cur.close(); conn.close()
        return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Method not allowed'})}

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

    if event.get('httpMethod') == 'DELETE':
        admin_key = (event.get('headers') or {}).get('X-Admin-Key', '')
        if admin_key != os.environ.get('ADMIN_KEY', 'unset'):
            return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Forbidden'})}
        body = json.loads(event.get('body') or '{}')
        order_id = body.get('order_id')
        if not order_id:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'order_id обязателен'})}
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        cur.execute(f"DELETE FROM {SCHEMA}.orders WHERE id=%s", (order_id,))
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    if event.get('httpMethod') == 'PATCH':
        admin_key = (event.get('headers') or {}).get('X-Admin-Key', '')
        expected = os.environ.get('ADMIN_KEY', 'unset')
        if admin_key != expected:
            return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Forbidden'})}
        body = json.loads(event.get('body') or '{}')
        order_id = body.get('order_id')
        new_status = body.get('status', '')
        new_items = body.get('items')
        new_total = body.get('total_price')

        if not order_id:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'order_id обязателен'})}
        if new_status and new_status not in VALID_STATUSES:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Некорректный status'})}

        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        cur.execute(f"SELECT id, user_id, status FROM {SCHEMA}.orders WHERE id=%s", (order_id,))
        order_row = cur.fetchone()
        if not order_row:
            cur.close(); conn.close()
            return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Заказ не найден'})}
        _, order_user_id, old_status = order_row

        if new_items is not None:
            import json as json_mod
            cur.execute(f"UPDATE {SCHEMA}.orders SET items=%s WHERE id=%s", (json_mod.dumps(new_items, ensure_ascii=False), order_id))
        if new_total is not None:
            cur.execute(f"UPDATE {SCHEMA}.orders SET total_price=%s WHERE id=%s", (float(new_total), order_id))
        if not new_status:
            conn.commit(); cur.close(); conn.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

        cur.execute(f"UPDATE {SCHEMA}.orders SET status=%s WHERE id=%s", (new_status, order_id))

        # Возврат баллов при отмене (только если раньше не был отменён)
        if new_status == 'cancelled' and old_status != 'cancelled' and order_user_id:
            cur.execute(
                f"SELECT ABS(points) FROM {SCHEMA}.loyalty_transactions WHERE user_id=%s AND reason=%s",
                (order_user_id, f'Списание баллов за заказ #{order_id}')
            )
            spent_row = cur.fetchone()
            if spent_row and spent_row[0] > 0:
                refund = spent_row[0]
                cur.execute(
                    f"UPDATE {SCHEMA}.users SET points = points + %s WHERE id=%s",
                    (refund, order_user_id)
                )
                cur.execute(
                    f"INSERT INTO {SCHEMA}.loyalty_transactions (user_id, points, reason) VALUES (%s, %s, %s)",
                    (order_user_id, refund, f'Возврат баллов за отменённый заказ #{order_id}')
                )

        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    if event.get('httpMethod') == 'PUT':
        body = json.loads(event.get('body') or '{}')
        order_id = body.get('order_id')
        user_id = body.get('user_id')
        address = body.get('address', '').strip()
        comment = body.get('comment', '').strip()
        items = body.get('items', [])
        if not order_id or not user_id:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'order_id и user_id обязательны'})}
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        cur.execute(
            f"SELECT status FROM {SCHEMA}.orders WHERE id=%s AND user_id=%s",
            (order_id, user_id)
        )
        row = cur.fetchone()
        if not row:
            cur.close(); conn.close()
            return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Заказ не найден'})}
        if row[0] != 'new':
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Заказ уже нельзя изменить'})}
        cur.execute(
            f"UPDATE {SCHEMA}.orders SET address=%s, comment=%s, items=%s WHERE id=%s",
            (address, comment, json.dumps(items), order_id)
        )
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    if event.get('httpMethod') == 'GET':
        params = event.get('queryStringParameters') or {}
        user_id = params.get('user_id')

        # Админский запрос — список пользователей
        if not user_id and params.get('admin') == '1' and params.get('tab') == 'users':
            admin_key = (event.get('headers') or {}).get('X-Admin-Key', '')
            expected = os.environ.get('ADMIN_KEY', 'unset')
            if admin_key != expected:
                return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Forbidden'})}
            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cur = conn.cursor()
            cur.execute(
                f"SELECT u.id, u.phone, u.name, u.points, u.is_first_order_done, u.created_at, u.last_seen_at, COUNT(o.id) as order_count FROM {SCHEMA}.users u LEFT JOIN {SCHEMA}.orders o ON o.user_id = u.id GROUP BY u.id ORDER BY u.last_seen_at DESC NULLS LAST, u.created_at DESC LIMIT 500"
            )
            rows = cur.fetchall()
            cur.close(); conn.close()
            users = [{
                'id': r[0], 'phone': r[1], 'name': r[2], 'points': r[3],
                'is_first_order_done': r[4],
                'created_at': r[5].isoformat() if r[5] else None,
                'last_seen_at': r[6].isoformat() if r[6] else None,
                'order_count': r[7],
            } for r in rows]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'users': users}, ensure_ascii=False)}

        # Админский запрос — все заказы
        if not user_id and params.get('admin') == '1':
            admin_key = (event.get('headers') or {}).get('X-Admin-Key', '')
            expected = os.environ.get('ADMIN_KEY', 'unset')
            if admin_key != expected:
                return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Forbidden'})}
            status_filter = params.get('status', '')
            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cur = conn.cursor()
            if status_filter and status_filter in VALID_STATUSES:
                cur.execute(
                    f"SELECT id, name, phone, address, comment, items, total_price, status, created_at, user_id FROM {SCHEMA}.orders WHERE status=%s ORDER BY created_at DESC LIMIT 200",
                    (status_filter,)
                )
            else:
                cur.execute(
                    f"SELECT id, name, phone, address, comment, items, total_price, status, created_at, user_id FROM {SCHEMA}.orders ORDER BY created_at DESC LIMIT 200"
                )
            rows = cur.fetchall()
            cur.close(); conn.close()
            orders = [{'id': r[0], 'name': r[1], 'phone': r[2], 'address': r[3], 'comment': r[4], 'items': r[5] or [], 'total_price': float(r[6]), 'status': r[7], 'created_at': r[8].isoformat(), 'user_id': r[9]} for r in rows]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'orders': orders}, ensure_ascii=False)}

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
        cur.execute(f"SELECT points, is_first_order_done, referred_by FROM {SCHEMA}.users WHERE id=%s", (user_id,))
        user_row = cur.fetchone()
        if user_row:
            points, is_first_order_done, referred_by = user_row

            if points_used > 0:
                actual_used = min(points_used, points)
                points = points - actual_used
                cur.execute(
                    f"INSERT INTO {SCHEMA}.loyalty_transactions (user_id, points, reason) VALUES (%s, %s, %s)",
                    (user_id, -actual_used, f'Списание баллов за заказ #{order_id}')
                )

            cur.execute(
                f"UPDATE {SCHEMA}.users SET points=%s WHERE id=%s",
                (points, user_id)
            )

            # Первый заказ приглашённого — начисляем 200 баллов пригласившему
            if not is_first_order_done and referred_by:
                cur.execute(
                    f"UPDATE {SCHEMA}.users SET points = points + %s WHERE id=%s",
                    (BONUS_FIRST_ORDER, referred_by)
                )
                cur.execute(
                    f"INSERT INTO {SCHEMA}.loyalty_transactions (user_id, points, reason) VALUES (%s, %s, %s)",
                    (referred_by, BONUS_FIRST_ORDER, f'Бонус за приглашённого друга (заказ #{order_id})')
                )

            # Помечаем первый заказ как выполненный
            if not is_first_order_done:
                cur.execute(
                    f"UPDATE {SCHEMA}.users SET is_first_order_done=TRUE WHERE id=%s",
                    (user_id,)
                )
                is_first_order_done = True

    conn.commit()
    cur.close()
    conn.close()

    send_email(name, phone, address, comment, items, total_price, order_id)

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({'ok': True, 'order_id': order_id, 'bonus': bonus, 'points': points, 'is_first_order_done': is_first_order_done})
    }