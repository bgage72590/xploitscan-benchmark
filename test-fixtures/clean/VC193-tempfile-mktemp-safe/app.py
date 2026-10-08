import io
import os
import subprocess
import tempfile

from flask import Flask, jsonify, request, send_file
from werkzeug.utils import secure_filename

app = Flask(__name__)

ALLOWED_EXTENSIONS = {".mp4", ".mov", ".webm"}


@app.route("/api/thumbnail", methods=["POST"])
def create_thumbnail():
    video = request.files.get("video")
    if video is None or video.filename == "":
        return jsonify({"error": "No video uploaded"}), 400

    ext = os.path.splitext(secure_filename(video.filename))[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return jsonify({"error": "Unsupported file type"}), 400

    # Don't use tempfile.mktemp() here: it only returns a name, so another
    # local process can plant a symlink before we open it. A private
    # TemporaryDirectory (mode 0700) is created atomically.
    with tempfile.TemporaryDirectory(prefix="thumb-") as workdir:
        input_path = os.path.join(workdir, "input" + ext)
        output_path = os.path.join(workdir, "thumb.jpg")
        video.save(input_path)

        try:
            subprocess.run(
                ["ffmpeg", "-y", "-i", input_path, "-ss", "00:00:01", "-vframes", "1", output_path],
                check=True,
                capture_output=True,
                timeout=30,
            )
        except subprocess.CalledProcessError:
            return jsonify({"error": "Could not process video"}), 422

        with open(output_path, "rb") as f:
            thumbnail = io.BytesIO(f.read())

    return send_file(thumbnail, mimetype="image/jpeg")


if __name__ == "__main__":
    app.run(port=5000)
