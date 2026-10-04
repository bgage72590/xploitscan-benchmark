import jwt
from flask import request, jsonify


def current_user():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    payload = jwt.decode(token, options={"verify_signature": False})
    return payload["sub"]


def whoami():
    return jsonify({"user": current_user()})
