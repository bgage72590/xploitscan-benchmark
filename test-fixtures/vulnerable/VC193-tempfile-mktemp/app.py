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

    # Generate temp paths for ffmpeg input/output
    input_path = tempfile.mktemp(suffix=ext)
    output_path = tempfile.mktemp(suffix=".jpg")
    video.save(input_path)

    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", input_path, "-ss", "00:00:01", "-vframes", "1", output_path],
            check=True,
            capture_output=True,
            timeout=30,
        )
        return send_file(output_path, mimetype="image/jpeg")
    except subprocess.CalledProcessError:
        return jsonify({"error": "Could not process video"}), 422
    finally:
        if os.path.exists(input_path):
            os.remove(input_path)


if __name__ == "__main__":
    app.run(port=5000)
