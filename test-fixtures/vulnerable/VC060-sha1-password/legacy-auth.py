# SHA1 for password hashing. Same family of problem as MD5: fast,
# no salt, no work factor. VC060 must fire.

import hashlib


def hash_password(plain: str) -> str:
    return hashlib.sha1(plain.encode("utf-8")).hexdigest()


def verify(plain: str, stored_hex: str) -> bool:
    return hash_password(plain) == stored_hex
