import json
import os
import random
import smtplib
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

    smtp_user = 'filini_ufa@mail.ru'
    smtp_password = os.environ['SMTP_PASSWORD']

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Код подтверждения — {code}'
    msg['From'] = smtp_user
    msg['To'] = smtp_user

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 400px; padding: 24px; background: #f9f9f9; border-radius: 12px;">
        <h2 style="color: #1a6b3c;">Код подтверждения</h2>
        <p>Номер телефона: <b>{phone}</b></p>
        <p style="font-size: 32px; font-weight: bold; color: #1a6b3c; letter-spacing: 6px;">{code}</p>
        <p style="color: #999; font-size: 12px;">Код действителен 10 минут</p>
    </div>
    """
    msg.attach(MIMEText(html, 'html'))

    with smtplib.SMTP_SSL('smtp.mail.ru', 465) as server:
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, smtp_user, msg.as_string())

    return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'dev_code': code})}