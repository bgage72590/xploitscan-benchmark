import os
from urllib.parse import urlencode

import requests
from flask import Blueprint, redirect, request, session, url_for

bp = Blueprint("github_login", __name__)


@bp.route("/login/github")
def login_github():
    params = {
        "client_id": os.environ["GITHUB_CLIENT_ID"],
        "redirect_uri": url_for("github_login.callback", _external=True),
        "scope": "read:user user:email",
    }
    return redirect(f"https://github.com/login/oauth/authorize?{urlencode(params)}")


@bp.route("/login/github/callback")
def callback():
    resp = requests.post(
        "https://github.com/login/oauth/access_token",
        data={
            "client_id": os.environ["GITHUB_CLIENT_ID"],
            "client_secret": os.environ["GITHUB_CLIENT_SECRET"],
            "code": request.args["code"],
        },
        headers={"Accept": "application/json"},
        timeout=10,
    )
    session["github_token"] = resp.json()["access_token"]
    return redirect("/dashboard")
