"""Field-level encryption for patient records (FastAPI backend)."""
import base64
import os

from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

KEY = base64.b64decode(os.environ["FIELD_ENCRYPTION_KEY"])  # 32 bytes


def encrypt_field(value: str) -> str:
    cipher = AES.new(KEY, AES.MODE_ECB)
    ct = cipher.encrypt(pad(value.encode("utf-8"), AES.block_size))
    return base64.b64encode(ct).decode("ascii")


def decrypt_field(token: str) -> str:
    cipher = AES.new(KEY, AES.MODE_ECB)
    pt = unpad(cipher.decrypt(base64.b64decode(token)), AES.block_size)
    return pt.decode("utf-8")
