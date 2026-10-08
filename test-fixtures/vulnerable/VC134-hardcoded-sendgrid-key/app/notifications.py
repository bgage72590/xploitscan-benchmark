"""Transactional email for the Flask backend."""
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

SENDGRID_API_KEY = "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"
FROM_EMAIL = "support@acme.dev"


def send_password_changed(to_email: str) -> None:
    message = Mail(
        from_email=FROM_EMAIL,
        to_emails=to_email,
        subject="Your password was changed",
        html_content="<p>If this wasn't you, contact support immediately.</p>",
    )
    SendGridAPIClient(SENDGRID_API_KEY).send(message)
