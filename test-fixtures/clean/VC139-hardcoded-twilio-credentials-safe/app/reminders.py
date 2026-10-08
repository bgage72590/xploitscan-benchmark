"""Appointment reminders sent by the nightly cron job."""
import os

from twilio.rest import Client

client = Client(os.environ["TWILIO_ACCOUNT_SID"], os.environ["TWILIO_AUTH_TOKEN"])


def send_reminder(phone: str, when: str) -> None:
    client.messages.create(
        messaging_service_sid=os.environ["TWILIO_MESSAGING_SERVICE_SID"],
        to=phone,
        body=f"Reminder: your appointment is {when}. Reply C to cancel.",
    )
