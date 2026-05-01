import json
import os
import secrets
import random
import string

import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}
SCHEMA = os.environ['MAIN_DB_SCHEMA']
BONUS_REGISTRATION = 200
BONUS_FIRST_ORDER = 200


def gen_referral_code():
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choices(chars, k=6))


def handler(event: dict, context) -> dict:
    """Проверка кода, регистрация/вход пользователя, начисление бонусов за регистрацию. Поддерживает реферальный код invite_code."""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    phone = body.get('phone', '').strip()
    code = body.get('code', '').strip()
    name = body.get('name', '').strip()
    invite_code = body.get('invite_code', '').strip().upper()

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

    cur.execute(f"SELECT id, name, points, is_first_order_done, referral_code FROM {SCHEMA}.users WHERE phone=%s", (phone,))
    user = cur.fetchone()

    is_new = False
    if not user:
        is_new = True

        referred_by_id = None
        if invite_code:
            cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE referral_code=%s", (invite_code,))
            inv = cur.fetchone()
            if inv:
                referred_by_id = inv[0]

        ref_code = gen_referral_code()
        for _ in range(10):
            cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE referral_code=%s", (ref_code,))
            if not cur.fetchone():
                break
            ref_code = gen_referral_code()

        if referred_by_id:
            cur.execute(
                f"INSERT INTO {SCHEMA}.users (phone, name, points, last_seen_at, referral_code, referred_by) VALUES (%s, %s, %s, NOW(), %s, %s) RETURNING id, name, points, is_first_order_done, referral_code",
                (phone, name or phone, BONUS_REGISTRATION, ref_code, referred_by_id)
            )
        else:
            cur.execute(
                f"INSERT INTO {SCHEMA}.users (phone, name, points, last_seen_at, referral_code) VALUES (%s, %s, %s, NOW(), %s) RETURNING id, name, points, is_first_order_done, referral_code",
                (phone, name or phone, BONUS_REGISTRATION, ref_code)
            )
        user = cur.fetchone()
        user_id = user[0]
        cur.execute(
            f"INSERT INTO {SCHEMA}.loyalty_transactions (user_id, points, reason) VALUES (%s, %s, %s)",
            (user_id, BONUS_REGISTRATION, 'Бонус за регистрацию')
        )
    else:
        user_id = user[0]
        cur.execute(f"UPDATE {SCHEMA}.users SET last_seen_at=NOW() WHERE id=%s", (user_id,))
        if name and not user[1]:
            cur.execute(f"UPDATE {SCHEMA}.users SET name=%s WHERE id=%s", (name, user_id))
        if not user[4]:
            ref_code = gen_referral_code()
            for _ in range(10):
                cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE referral_code=%s", (ref_code,))
                if not cur.fetchone():
                    break
                ref_code = gen_referral_code()
            cur.execute(f"UPDATE {SCHEMA}.users SET referral_code=%s WHERE id=%s AND referral_code IS NULL", (ref_code, user_id))

    conn.commit()

    cur.execute(f"SELECT referral_code FROM {SCHEMA}.users WHERE id=%s", (user[0],))
    ref_row = cur.fetchone()
    referral_code = ref_row[0] if ref_row else None

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
                'referral_code': referral_code,
            }
        })
    }
