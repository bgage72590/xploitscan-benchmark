# Correct Python containment checks: commonpath, is_relative_to, and a
# startswith with os.sep appended. None admits a sibling sharing the prefix.
import os
from pathlib import Path

from flask import Flask, abort, request, send_file

app = Flask(__name__)
FILES_DIR = os.path.realpath("/srv/files")
REPORTS_DIR = Path("/srv/reports").resolve()


@app.get("/download")
def download():
    requested = os.path.realpath(os.path.join(FILES_DIR, request.args["path"]))
    if os.path.commonpath([FILES_DIR, requested]) != FILES_DIR:
        abort(403)
    return send_file(requested)


@app.get("/report")
def report():
    target = (REPORTS_DIR / request.args["name"]).resolve()
    if not target.is_relative_to(REPORTS_DIR):
        abort(403)
    return send_file(target)


@app.get("/attachment")
def attachment():
    real_path = os.path.realpath(os.path.join(FILES_DIR, request.args["name"]))
    if not real_path.startswith(FILES_DIR + os.sep):
        abort(403)
    with open(real_path, "rb") as fh:
        return fh.read()
