import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def handler(event: dict, context) -> dict:
    """Отправка заявки с сайта ОвощиМаркет на почту filimono_86@mail.ru"""

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()
    comment = body.get('comment', '').strip()

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': {'error': 'Имя и телефон обязательны'}
        }

    smtp_user = 'filimono_86@mail.ru'
    smtp_password = os.environ['SMTP_PASSWORD']

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка с сайта ОвощиМаркет — {name}'
    msg['From'] = smtp_user
    msg['To'] = smtp_user

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 24px; background: #f9f9f9; border-radius: 12px;">
        <h2 style="color: #1a6b3c; margin-bottom: 16px;">🥬 Новая заявка с сайта</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #666; width: 120px;">Имя:</td>
                <td style="padding: 8px 0; font-weight: bold;">{name}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #666;">Телефон:</td>
                <td style="padding: 8px 0; font-weight: bold;"><a href="tel:{phone}" style="color: #1a6b3c;">{phone}</a></td>
            </tr>
            {"<tr><td style='padding: 8px 0; color: #666;'>Комментарий:</td><td style='padding: 8px 0;'>" + comment + "</td></tr>" if comment else ""}
        </table>
        <p style="margin-top: 20px; color: #999; font-size: 12px;">Заявка отправлена с сайта ОвощиМаркет</p>
    </div>
    """

    msg.attach(MIMEText(html, 'html'))

    with smtplib.SMTP_SSL('smtp.mail.ru', 465) as server:
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, smtp_user, msg.as_string())

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({'ok': True})
    }