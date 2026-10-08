"""Downloads the embedding model weights at build time, with a progress bar."""
import os
import sys

import requests
from tqdm import tqdm

MODEL_URL = os.environ.get("MODEL_URL", "https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2/resolve/main/model.safetensors")


def fetch(url: str, dest: str) -> None:
    r = requests.get(url, stream=True, timeout=60)
    r.raise_for_status()
    total = int(r.headers['Content-Length'])
    with open(dest, "wb") as f, tqdm(total=total, unit="B", unit_scale=True) as bar:
        for chunk in r.iter_content(chunk_size=1 << 16):
            f.write(chunk)
            bar.update(len(chunk))


if __name__ == "__main__":
    fetch(MODEL_URL, sys.argv[1] if len(sys.argv) > 1 else "model.safetensors")
