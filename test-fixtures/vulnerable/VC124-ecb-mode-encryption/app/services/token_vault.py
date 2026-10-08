"""Encrypts OAuth refresh tokens at rest using the `cryptography` package."""
import os

from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

VAULT_KEY = bytes.fromhex(os.environ["VAULT_KEY"])  # 32 bytes


def seal(token: str) -> bytes:
    padder = padding.PKCS7(128).padder()
    data = padder.update(token.encode()) + padder.finalize()
    encryptor = Cipher(algorithms.AES(VAULT_KEY), modes.ECB()).encryptor()
    return encryptor.update(data) + encryptor.finalize()


def unseal(blob: bytes) -> str:
    decryptor = Cipher(algorithms.AES(VAULT_KEY), modes.ECB()).decryptor()
    data = decryptor.update(blob) + decryptor.finalize()
    unpadder = padding.PKCS7(128).unpadder()
    return (unpadder.update(data) + unpadder.finalize()).decode()
