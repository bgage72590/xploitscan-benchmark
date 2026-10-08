"""Transactional email for the Flask backend."""
import os

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

FROM_EMAIL = "support@acme.dev"
_client = SendGridAPIClient(os.environ["SENDGRID_API_KEY"])


def send_password_changed(to_email: str) -> None:
    message = Mail(
        from_email=FROM_EMAIL,
        to_emails=to_email,
        subject="Your password was changed",
        html_content="<p>If this wasn't you, contact support immediately.</p>",
    )
    _client.send(message)
