import json
import smtplib
import os
import uuid
import base64
import boto3
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def handler(event: dict, context) -> dict:
    """Отправка заявки с сайта ОвощиМаркет на почту filini_ufa@mail.ru. Также обрабатывает загрузку фото товаров через action=upload."""

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    body = json.loads(event.get('body') or '{}')

    if body.get('action') == 'upload':
        image_b64 = body.get('image')
        content_type = body.get('contentType', 'image/jpeg')
        old_url = body.get('oldUrl', '')

        if not image_b64:
            return {'statusCode': 400, 'headers': cors_headers, 'body': json.dumps({'error': 'No image provided'})}

        ext_map = {'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif'}
        ext = ext_map.get(content_type, 'jpg')
        key = f"products/{uuid.uuid4()}.{ext}"

        image_data = base64.b64decode(image_b64)

        project_id = os.environ['AWS_ACCESS_KEY_ID']
        s3 = boto3.client(
            's3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=project_id,
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )
        s3.put_object(Bucket='files', Key=key, Body=image_data, ContentType=content_type)

        # Удаляем старое фото если оно хранится в нашем S3 (bucket или files)
        if old_url:
            cdn_prefix_bucket = f"https://cdn.poehali.dev/projects/{project_id}/bucket/"
            cdn_prefix_files = f"https://cdn.poehali.dev/projects/{project_id}/files/"
            old_key = None
            if old_url.startswith(cdn_prefix_bucket):
                old_key = old_url[len(cdn_prefix_bucket):]
            elif old_url.startswith(cdn_prefix_files):
                old_key = old_url[len(cdn_prefix_files):]
            if old_key:
                try:
                    s3.delete_object(Bucket='files', Key=old_key)
                except Exception:
                    pass

        url = f"https://cdn.poehali.dev/projects/{project_id}/files/{key}"

        return {'statusCode': 200, 'headers': cors_headers, 'body': json.dumps({'url': url})}

    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()
    comment = body.get('comment', '').strip()

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': {'error': 'Имя и телефон обязательны'}
        }

    smtp_user = 'filini_ufa@mail.ru'
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