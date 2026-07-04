from flask import Flask
app = Flask(__name__)
# Hardcoded Flask session signing key (VC072) — anyone with the source can
# forge session cookies.
app.config["SECRET_KEY"] = "sk-prod-9f2b7c1a4e8d3f60b5a2c9e1"

@app.route("/")
def index():
    return "hello"
