# Django project settings with CSRF middleware removed from the stack.
# Any state-changing POST/PUT/DELETE is forgeable from a third-party
# origin. VC074 must fire.

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    # "django.middleware.csrf.CsrfViewMiddleware",  # disabled during migration
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]

CSRF_COOKIE_SECURE = False
