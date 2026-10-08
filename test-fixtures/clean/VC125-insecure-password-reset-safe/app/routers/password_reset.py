import hashlib
import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.database import get_db
from app.email import send_email
from app.models import User
from app.security import hash_password

router = APIRouter(prefix="/auth", tags=["auth"])

GENERIC = {"message": "If that email is registered, a reset code has been sent."}


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str
    new_password: str


def _digest(code: str) -> str:
    return hashlib.sha256(code.encode()).hexdigest()


@router.post("/forgot-password")
def forgot_password(body: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user:
        return GENERIC  # same answer either way: no account enumeration
    reset_code = f"{secrets.randbelow(1_000_000):06d}"
    user.reset_code_hash = _digest(reset_code)
    user.reset_code_expires = datetime.utcnow() + timedelta(minutes=15)
    user.reset_attempts = 0
    db.commit()
    send_email(user.email, "Your password reset code", f"Your code is {reset_code}")
    return GENERIC


@router.post("/reset-password")
def reset_password(body: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if (
        not user
        or user.reset_code_hash is None
        or user.reset_code_expires < datetime.utcnow()
        or user.reset_attempts >= 5
        or not secrets.compare_digest(user.reset_code_hash, _digest(body.code))
    ):
        if user:
            user.reset_attempts += 1
            db.commit()
        raise HTTPException(status_code=400, detail="Invalid or expired code")
    user.hashed_password = hash_password(body.new_password)
    user.reset_code_hash = None
    db.commit()
    return {"message": "Password updated"}
