from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager

app = Flask(__name__)
login_manager = LoginManager(app)

# Shape of emfcamp/Website main.py: the API has an explicit origin list and
# only static files (the same bytes for every visitor) allow every origin.
cors_origins = ["https://map.emfcamp.org", "https://wiki.emfcamp.org"]
if app.config.get("DEBUG"):
    cors_origins = ["http://localhost:8080", "https://maputnik.github.io"]

CORS(
    app,
    resources={
        r"/api/.*": {"origins": cors_origins},
        r"/static/.*": {"origins": ["*"]},
    },
    supports_credentials=True,
)
