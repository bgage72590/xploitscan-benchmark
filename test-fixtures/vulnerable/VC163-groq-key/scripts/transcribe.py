"""Batch-transcribes the podcast archive with Groq Whisper.

Notebook-style setup: the key is assigned into os.environ at the top so the
Groq client (which reads GROQ_API_KEY) picks it up. The literal key is still
committed.
"""
import os
from pathlib import Path

os.environ["GROQ_API_KEY"] = "gsk_FAKE0000FAKE0000FAKE0000FAKE0000FAKE0000FAKE0000FAKE"

from groq import Groq

client = Groq()

for audio in sorted(Path("episodes").glob("*.mp3")):
    with audio.open("rb") as f:
        result = client.audio.transcriptions.create(
            file=(audio.name, f.read()),
            model="whisper-large-v3-turbo",
        )
    audio.with_suffix(".txt").write_text(result.text)
