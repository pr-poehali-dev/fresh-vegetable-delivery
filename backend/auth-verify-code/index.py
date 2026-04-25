import json
import os
import secrets
from datetime import datetime

import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}
SCHEMA = os.environ['MAIN_DB_SCHEMA']
BONUS_REGISTRATION = 200
BONUS_FIRST_ORDER = 200


def handler(event: dict, context) -> dict:
    """Проверка кода, регистрация/вход пользователя, начисление бонусов за регистрацию"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    phone = body.get('phone', '').strip()
    code = body.get('code', '').strip()
    name = body.get('name', '').strip()

    if not phone or not code:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Укажите телефон и код'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(
        f"SELECT id FROM {SCHEMA}.sms_codes WHERE phone=%s AND code=%s AND used=FALSE AND expires_at > NOW() ORDER BY id DESC LIMIT 1",
        (phone, code)
    )
    row = cur.fetchone()

    if not row:
        cur.close()
        conn.close()
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Неверный или истёкший код'})}

    sms_id = row[0]
    cur.execute(f"UPDATE {SCHEMA}.sms_codes SET used=TRUE WHERE id=%s", (sms_id,))

    cur.execute(f"SELECT id, name, points, is_first_order_done FROM {SCHEMA}.users WHERE phone=%s", (phone,))
    user = cur.fetchone()

    is_new = False
    if not user:
        is_new = True
        cur.execute(
            f"INSERT INTO {SCHEMA}.users (phone, name, points) VALUES (%s, %s, %s) RETURNING id, name, points, is_first_order_done",
            (phone, name or phone, BONUS_REGISTRATION)
        )
        user = cur.fetchone()
        user_id = user[0]
        cur.execute(
            f"INSERT INTO {SCHEMA}.loyalty_transactions (user_id, points, reason) VALUES (%s, %s, %s)",
            (user_id, BONUS_REGISTRATION, 'Бонус за регистрацию')
        )
    else:
        user_id = user[0]
        if name and not user[1]:
            cur.execute(f"UPDATE {SCHEMA}.users SET name=%s WHERE id=%s", (name, user_id))

    conn.commit()

    token = secrets.token_hex(32)

    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({
            'ok': True,
            'token': token,
            'user': {
                'id': user[0],
                'phone': phone,
                'name': user[1] or name or phone,
                'points': user[2],
                'is_first_order_done': user[3],
                'is_new': is_new,
            }
        })
    }
