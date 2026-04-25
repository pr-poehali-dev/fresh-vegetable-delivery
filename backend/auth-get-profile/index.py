import json
import os

import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
}
SCHEMA = os.environ['MAIN_DB_SCHEMA']


def handler(event: dict, context) -> dict:
    """Получение профиля пользователя и баланса баллов по user_id"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    headers = event.get('headers') or {}
    user_id = headers.get('X-User-Id') or (event.get('queryStringParameters') or {}).get('user_id')

    if not user_id:
        return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(
        f"SELECT id, phone, name, points, is_first_order_done, created_at FROM {SCHEMA}.users WHERE id=%s",
        (int(user_id),)
    )
    user = cur.fetchone()

    if not user:
        cur.close()
        conn.close()
        return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Пользователь не найден'})}

    cur.execute(
        f"SELECT points, reason, created_at FROM {SCHEMA}.loyalty_transactions WHERE user_id=%s ORDER BY created_at DESC LIMIT 10",
        (int(user_id),)
    )
    transactions = [{'points': r[0], 'reason': r[1], 'date': r[2].strftime('%d.%m.%Y')} for r in cur.fetchall()]

    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({
            'id': user[0],
            'phone': user[1],
            'name': user[2],
            'points': user[3],
            'is_first_order_done': user[4],
            'transactions': transactions,
        })
    }
