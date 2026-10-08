import os

from authlib.integrations.flask_client import OAuth
from flask import Blueprint, redirect, session, url_for

from .models import upsert_github_user

oauth = OAuth()
oauth.register(
    name="github",
    client_id=os.environ["GITHUB_CLIENT_ID"],
    client_secret=os.environ["GITHUB_CLIENT_SECRET"],
    access_token_url="https://github.com/login/oauth/access_token",
    authorize_url="https://github.com/login/oauth/authorize",
    api_base_url="https://api.github.com/",
    client_kwargs={"scope": "user:email"},
)

bp = Blueprint("auth", __name__)


@bp.route("/login/github")
def login_github():
    # Authlib adds a random OAuth state value to the redirect, keeps it in the
    # session and rejects a callback that does not echo it back.
    redirect_uri = url_for("auth.github_callback", _external=True)
    return oauth.github.authorize_redirect(redirect_uri)


@bp.route("/auth/github/callback")
def github_callback():
    token = oauth.github.authorize_access_token()
    profile = oauth.github.get("user", token=token).json()
    session["user_id"] = upsert_github_user(profile)
    return redirect("/dashboard")
