"""Create the key pair used to sign product license files."""
from pathlib import Path

import rsa

OUT = Path(__file__).resolve().parent.parent / "keys"


def main() -> None:
    OUT.mkdir(exist_ok=True)
    (pubkey, privkey) = rsa.newkeys(3072)
    (OUT / "license_public.pem").write_bytes(pubkey.save_pkcs1())
    (OUT / "license_private.pem").write_bytes(privkey.save_pkcs1())


if __name__ == "__main__":
    main()
