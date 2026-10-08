import logging

from flask import Blueprint, redirect, render_template, request, session, url_for
from werkzeug.security import check_password_hash

from app.models import AdminUser

bp = Blueprint("admin_auth", __name__, url_prefix="/admin")
logger = logging.getLogger(__name__)


@bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("admin/login.html")

    email = request.form["email"]
    logger.info("Admin login attempt from %s", request.remote_addr)
    admin = AdminUser.query.filter_by(email=email).first()
    if admin is None or not check_password_hash(admin.password_hash, request.form["password"]):
        logger.warning("Admin login failed: bad email or password (ip=%s)", request.remote_addr)
        return render_template("admin/login.html", error="Invalid credentials"), 401

    session["admin_id"] = admin.id
    logger.info("Admin %s logged in", admin.id)
    return redirect(url_for("admin.dashboard"))
