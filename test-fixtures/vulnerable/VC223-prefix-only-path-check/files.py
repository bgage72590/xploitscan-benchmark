# Flask file server with a prefix-only containment check. realpath resolves
# "../files-private/report.pdf" to /srv/files-private/report.pdf, which
# starts with "/srv/files" and passes.
import os

from flask import Flask, abort, request, send_file

app = Flask(__name__)
FILES_DIR = os.path.realpath("/srv/files")


@app.get("/download")
def download():
    requested = os.path.realpath(os.path.join(FILES_DIR, request.args["path"]))
    if not requested.startswith(FILES_DIR):
        abort(403)
    return send_file(requested)
