"""Event-ingest endpoint behind the load balancer.

Flask/Werkzeug frames the request body (Content-Length or chunked) itself;
MAX_CONTENT_LENGTH rejects oversized bodies before we touch them.
"""
import json
import os

from flask import Flask, jsonify, request

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 1 * 1024 * 1024


@app.post("/events")
def ingest():
    payload = request.get_json(force=True)
    with open("/var/data/events.jsonl", "a") as f:
        f.write(json.dumps(payload) + "\n")
    return jsonify(status="accepted"), 202


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "8000")))
