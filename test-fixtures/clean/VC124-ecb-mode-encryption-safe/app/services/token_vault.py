"""Encrypts OAuth refresh tokens at rest using the `cryptography` package."""
import os

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

VAULT_KEY = bytes.fromhex(os.environ["VAULT_KEY"])  # 32 bytes


def seal(token: str) -> bytes:
    nonce = os.urandom(12)
    return nonce + AESGCM(VAULT_KEY).encrypt(nonce, token.encode(), None)


def unseal(blob: bytes) -> str:
    nonce, ct = blob[:12], blob[12:]
    return AESGCM(VAULT_KEY).decrypt(nonce, ct, None).decode()
