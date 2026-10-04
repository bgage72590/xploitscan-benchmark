import os

from flask import Flask, abort, send_file

app = Flask(__name__)
DOCS_DIR = os.path.abspath("docs")


@app.route("/docs/<path:name>")
def docs(name):
    if ".." in name or name.startswith("/"):
        abort(400)
    full = os.path.abspath(os.path.join(DOCS_DIR, name))
    if not full.startswith(DOCS_DIR):
        abort(403)
    return send_file(full)
