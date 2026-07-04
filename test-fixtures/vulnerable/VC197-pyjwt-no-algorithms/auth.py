# PyJWT decode without algorithms= allowlist. The decoder accepts whatever
# `alg` the token's header claims, including `none` — letting attackers
# forge any payload. VC197 must fire.
import jwt


def get_user_from_token(token: str, secret: str):
    # Missing algorithms=[...] — accepts any algorithm including 'none'.
    payload = jwt.decode(token, secret)
    return payload.get("sub")
