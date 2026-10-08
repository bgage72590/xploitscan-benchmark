from pathlib import Path

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa

KEY_DIR = Path(__file__).parent / "keys"


def generate_jwt_keys() -> None:
    """Create the RS256 key pair FastAPI uses to sign access tokens."""
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=4096,
    )
    KEY_DIR.mkdir(exist_ok=True)
    (KEY_DIR / "private.pem").write_bytes(
        private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption(),
        )
    )
    (KEY_DIR / "public.pem").write_bytes(
        private_key.public_key().public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo,
        )
    )
