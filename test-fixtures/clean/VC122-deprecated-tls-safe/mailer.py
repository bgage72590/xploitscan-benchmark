import os
import smtplib
import ssl
from email.message import EmailMessage

SMTP_HOST = os.environ["SMTP_HOST"]


def send_receipt(to: str, html: str) -> None:
    msg = EmailMessage()
    msg["Subject"] = "Your receipt"
    msg["From"] = "billing@acme.example"
    msg["To"] = to
    msg.set_content(html, subtype="html")

    # Pin the relay connection to TLS 1.2.
    context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
    context.load_default_certs()
    context.check_hostname = True
    context.verify_mode = ssl.CERT_REQUIRED
    with smtplib.SMTP_SSL(SMTP_HOST, 465, context=context) as smtp:
        smtp.login(os.environ["SMTP_USER"], os.environ["SMTP_PASSWORD"])
        smtp.send_message(msg)
