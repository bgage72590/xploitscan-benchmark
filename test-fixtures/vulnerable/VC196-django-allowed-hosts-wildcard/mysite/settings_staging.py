"""Staging settings for Railway preview environments."""
from .settings_production import *  # noqa: F401,F403

# Preview deploys get a random *.up.railway.app hostname, so accept any host.
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "[::1]", "*"]
CSRF_TRUSTED_ORIGINS = ["https://*.up.railway.app"]

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
