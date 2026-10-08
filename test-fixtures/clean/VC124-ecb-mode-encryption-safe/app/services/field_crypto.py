"""Field-level encryption for patient records (FastAPI backend)."""
import base64
import os

from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

KEY = base64.b64decode(os.environ["FIELD_ENCRYPTION_KEY"])  # 32 bytes


def encrypt_field(value: str) -> str:
    nonce = get_random_bytes(12)
    cipher = AES.new(KEY, AES.MODE_GCM, nonce=nonce)
    ct, tag = cipher.encrypt_and_digest(value.encode("utf-8"))
    return base64.b64encode(nonce + tag + ct).decode("ascii")


def decrypt_field(token: str) -> str:
    raw = base64.b64decode(token)
    nonce, tag, ct = raw[:12], raw[12:28], raw[28:]
    cipher = AES.new(KEY, AES.MODE_GCM, nonce=nonce)
    return cipher.decrypt_and_verify(ct, tag).decode("utf-8")
