"""Production settings — used on Render via DJANGO_SETTINGS_MODULE=mysite.settings_production."""
import os

import dj_database_url

from .settings import *  # noqa: F401,F403

DEBUG = False

SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]

# Comma-separated list of hosts, e.g. "myapp.onrender.com,myapp.com".
# Fail closed: an unset variable means no host is accepted.
ALLOWED_HOSTS = [h.strip() for h in os.environ.get("ALLOWED_HOSTS", "").split(",") if h.strip()]
CSRF_TRUSTED_ORIGINS = [f"https://{h.lstrip('.')}" for h in ALLOWED_HOSTS]

DATABASES = {"default": dj_database_url.config(conn_max_age=600, ssl_require=True)}

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

DEFAULT_FROM_EMAIL = "noreply@myapp.com"
