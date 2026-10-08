"""Appointment reminders sent by the nightly cron job."""
from twilio.rest import Client

client = Client("ACed01e5cc444242844f98132fc0633689", "0a093671d04d1b5ec2ec464ada59be5c")


def send_reminder(phone: str, when: str) -> None:
    client.messages.create(
        from_="+14155550123",
        to=phone,
        body=f"Reminder: your appointment is {when}. Reply C to cancel.",
    )
