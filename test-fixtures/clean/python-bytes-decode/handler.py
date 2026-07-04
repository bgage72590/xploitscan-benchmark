# bytes.decode() and base64.b64decode() are extremely common in Python
# and have nothing to do with JWT. VC197 must NOT fire on these — the
# rule's bare-`decode(` pattern is gated on a `from jwt import` line.
import base64
import json


def parse_payload(raw: bytes) -> dict:
    # Standard pattern: bytes → str → json
    text = raw.decode("utf-8")
    return json.loads(text)


def parse_b64_blob(blob: str) -> bytes:
    # Common base64 helper — also has "decode" in the name but not jwt.
    return base64.b64decode(blob)
