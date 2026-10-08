"""Django signal that purges a post's surrogate key from Fastly when it is
saved, so readers see the edit immediately. The token is written straight
into the Fastly-Key header.
This should trigger VC169 (Hardcoded Fastly API Token).
"""
import requests
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Post

SERVICE_ID = "SU1Z0isxPaozGVKXdv0eY"


@receiver(post_save, sender=Post)
def purge_post(sender, instance, **kwargs):
    requests.post(
        f"https://api.fastly.com/service/{SERVICE_ID}/purge/post-{instance.pk}",
        headers={"Fastly-Key": "FAKE0000FAKE0000FAKE0000FAKE0000", "Accept": "application/json"},
        timeout=5,
    )
