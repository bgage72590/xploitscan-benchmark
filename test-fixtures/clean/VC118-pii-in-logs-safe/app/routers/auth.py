import logging
import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.email import send_reset_email
from app.models import PasswordReset, User
from app.schemas import ForgotPasswordIn, LoginIn
from app.security import create_access_token, hash_code, verify_password

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth")


def mask_email(email: str) -> str:
    name, _, domain = email.partition("@")
    return f"{name[:2]}***@{domain}"


@router.post("/login")
def login(body: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.password, user.password_hash):
        logger.warning("Failed login for %s: invalid email or password", mask_email(body.email))
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"access_token": create_access_token(user.id), "token_type": "bearer"}


@router.post("/forgot-password")
def forgot_password(body: ForgotPasswordIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if user:
        code = secrets.token_urlsafe(32)
        db.add(PasswordReset(user_id=user.id, code_hash=hash_code(code),
                             expires_at=datetime.utcnow() + timedelta(hours=1)))
        db.commit()
        logger.info("Password reset token issued for user %s", user.id)
        send_reset_email(user.email, code)
    return {"ok": True}
