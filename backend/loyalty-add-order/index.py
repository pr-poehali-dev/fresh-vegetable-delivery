import json
import os
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}
SCHEMA = os.environ['MAIN_DB_SCHEMA']
BONUS_FIRST_ORDER = 200


def handler(event: dict, context) -> dict:
    """Начисление баллов за первый заказ пользователю"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    user_id = body.get('user_id')

    if not user_id:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'user_id обязателен'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(f"SELECT points, is_first_order_done FROM {SCHEMA}.users WHERE id=%s", (user_id,))
    user = cur.fetchone()

    if not user:
        cur.close()
        conn.close()
        return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Пользователь не найден'})}

    points, is_first_order_done = user
    bonus = 0

    if not is_first_order_done:
        bonus = BONUS_FIRST_ORDER
        new_points = points + bonus
        cur.execute(
            f"UPDATE {SCHEMA}.users SET points=%s, is_first_order_done=TRUE WHERE id=%s",
            (new_points, user_id)
        )
        cur.execute(
            f"INSERT INTO {SCHEMA}.loyalty_transactions (user_id, points, reason) VALUES (%s, %s, %s)",
            (user_id, bonus, 'Бонус за первый заказ')
        )
        conn.commit()
        points = new_points

    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({'ok': True, 'bonus': bonus, 'points': points})
    }
