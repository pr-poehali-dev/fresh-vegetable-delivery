import json
import os
import random
import smtplib
import urllib.request
import urllib.parse
from datetime import datetime, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}
SCHEMA = os.environ['MAIN_DB_SCHEMA']


def handler(event: dict, context) -> dict:
    """Отправка SMS-кода на номер телефона для авторизации"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    phone = body.get('phone', '').strip()

    if not phone:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Укажите номер телефона'})}

    code = str(random.randint(100000, 999999))
    expires_at = datetime.now() + timedelta(minutes=10)

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(
        f"INSERT INTO {SCHEMA}.sms_codes (phone, code, expires_at) VALUES (%s, %s, %s)",
        (phone, code, expires_at)
    )
    conn.commit()
    cur.close()
    conn.close()

    sms_sent = False
    smsc_login = os.environ.get('SMSC_LOGIN', '')
    smsc_password = os.environ.get('SMSC_PASSWORD', '')

    if smsc_login and smsc_password:
        sms_text = f'Ваш код входа в Филини: {code}. Действителен 10 минут.'
        params = urllib.parse.urlencode({
            'login': smsc_login,
            'psw': smsc_password,
            'phones': phone,
            'mes': sms_text,
            'fmt': 3,
            'charset': 'utf-8',
        })
        req = urllib.request.urlopen(f'https://smsc.ru/sys/send.php?{params}', timeout=10)
        resp = json.loads(req.read().decode('utf-8'))
        sms_sent = 'error' not in resp

    dev_code = code if not sms_sent else None
    return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'dev_code': dev_code})}