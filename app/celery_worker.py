import os
import time
import smtplib
from email.message import EmailMessage
from celery import Celery
from dotenv import load_dotenv

load_dotenv(".env")

celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND")

@celery.task(name="create_task")
def create_task(a, b, c, to_email, subject, message_body="DO YOUR FUCKING TODO"):
    # Simulate some work
    time.sleep(a)
    
    # Create the email message.
    msg = EmailMessage()
    msg.set_content(message_body)
    msg["Subject"] = subject
    msg["From"] = os.environ.get("EMAIL_FROM")
    msg["To"] = to_email

    # Connect to the SMTP server and send the email.
    with smtplib.SMTP(os.environ.get("SMTP_SERVER"), int(os.environ.get("SMTP_PORT"))) as server:
        server.starttls()
        server.login(os.environ.get("EMAIL_USERNAME"), os.environ.get("EMAIL_PASSWORD"))
        server.send_message(msg)
    
    return b + c
