"""Copy waitlist signups from Postgres into the team's Notion CRM database.

Written against an older integration, so the token still has the legacy
secret_ prefix.
"""
import os

import psycopg2
from notion_client import Client

NOTION_TOKEN = "secret_FsJoryFdtpkZNYLkoOFpn0YoF42Hpdu1lpYvSIZrHIU"
CRM_DATABASE_ID = "9f8e7d6c5b4a43219f8e7d6c5b4a4321"

notion = Client(auth=NOTION_TOKEN)


def export_waitlist():
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    with conn.cursor() as cur:
        cur.execute("SELECT email, created_at FROM waitlist WHERE exported = false")
        for email, created_at in cur.fetchall():
            notion.pages.create(
                parent={"database_id": CRM_DATABASE_ID},
                properties={
                    "Email": {"title": [{"text": {"content": email}}]},
                    "Signed up": {"date": {"start": created_at.isoformat()}},
                },
            )


if __name__ == "__main__":
    export_waitlist()
