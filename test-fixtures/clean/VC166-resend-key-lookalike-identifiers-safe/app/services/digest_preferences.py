"""Per-user preferences for the weekly email digest (sent through Resend)."""
import os
from dataclasses import dataclass, field

import resend

resend.api_key = os.environ["RESEND_API_KEY"]


@dataclass
class DigestPreferences:
    user_id: str
    weekly_digest: bool = True
    muted_topics: list[str] = field(default_factory=list)


_store_user_preferences_cache: dict[str, DigestPreferences] = {}


def restore_user_preferences_from_cache(user_id: str) -> DigestPreferences:
    return _store_user_preferences_cache.get(user_id) or DigestPreferences(user_id=user_id)


def compare_preferences_snapshots(old: DigestPreferences, new: DigestPreferences) -> bool:
    return old.weekly_digest != new.weekly_digest or old.muted_topics != new.muted_topics


def send_digest(to: str, html: str) -> None:
    resend.Emails.send({
        "from": "Acme <digest@acme-labs.io>",
        "to": [to],
        "subject": "Your weekly digest",
        "html": html,
    })
