# Flask-CORS with supports_credentials=True and no origins: Flask-CORS
# defaults origins to "*" and, with credentials on, echoes the request's
# Origin back. No cookie auth is visible in this file, so medium.
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)


@app.get("/api/items")
def items():
    return jsonify([])
