# Flask-CORS with credentials and a real origin restriction, set three ways.
from flask import Flask, session
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, origins=["https://app.example.com"], supports_credentials=True)

admin = Flask("admin")
CORS(admin, resources={r"/api/*": {"origins": ["https://admin.example.com"]}}, supports_credentials=True)


@app.get("/api/me")
@cross_origin(origins=["https://app.example.com"], supports_credentials=True)
def me():
    return {"user": session.get("user")}
