"""Django signal that purges a post's surrogate key from Fastly on save.
The token comes from Django settings, which read it from the environment.
VC169 must NOT fire.
"""
import requests
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Post


@receiver(post_save, sender=Post)
def purge_post(sender, instance, **kwargs):
    requests.post(
        f"https://api.fastly.com/service/{settings.FASTLY_SERVICE_ID}/purge/post-{instance.pk}",
        headers={"Fastly-Key": settings.FASTLY_API_TOKEN, "Accept": "application/json"},
        timeout=5,
    )
