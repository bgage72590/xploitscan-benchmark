# `from jwt import decode` form — VC197 should still catch this even
# though the call site reads `decode(...)` with no `jwt.` prefix.
# Macroscope review on PR #308 flagged that the original regex missed
# this shape.
from jwt import decode


def get_user_from_token(token: str, secret: str):
    # No algorithms= → accepts alg:none, attackers can forge tokens.
    payload = decode(token, secret)
    return payload.get("sub")
