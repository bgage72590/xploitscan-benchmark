import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

security = HTTPBearer()
KEYS_BY_TENANT = {"acme": "-----BEGIN PUBLIC KEY-----acme", "globex": "-----BEGIN PUBLIC KEY-----globex"}


def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    # Read the tenant without verifying, only to pick that tenant's key.
    unverified = jwt.decode(token, algorithms=["RS256"], options={"verify_signature": False})
    key = KEYS_BY_TENANT.get(unverified["tenant_id"])
    if not key:
        raise HTTPException(status_code=401, detail="Unknown tenant")
    payload = jwt.decode(token, key, algorithms=["RS256"], audience="api")
    return payload["sub"]
