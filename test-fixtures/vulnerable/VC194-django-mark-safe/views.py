# Django mark_safe() called on user-controlled bio text — XSS sink.
# VC194 must fire.
from django.utils.safestring import mark_safe
from django.shortcuts import render


def profile(request, username):
    user = get_user_or_404(username)
    # AI generated this when asked for "rich-text user bios". The bio
    # is unsanitized HTML straight from the user.
    rendered_bio = mark_safe(user.bio)
    return render(request, "profile.html", {"bio": rendered_bio})


def get_user_or_404(username):
    """Stub — real impl looks up the user model."""
    return type("U", (), {"bio": ""})()
