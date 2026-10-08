import random
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.database import get_db
from app.email import send_email
from app.models import User
from app.security import hash_password

router = APIRouter(prefix="/auth", tags=["auth"])


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str
    new_password: str


@router.post("/forgot-password")
def forgot_password(body: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not registered")
    reset_code = str(random.randint(100000, 999999))
    user.reset_code = reset_code
    user.reset_code_expires = datetime.utcnow() + timedelta(minutes=15)
    db.commit()
    send_email(user.email, "Your password reset code", f"Your code is {reset_code}")
    return {"message": "Reset code sent"}


@router.post("/reset-password")
def reset_password(body: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or user.reset_code != body.code or user.reset_code_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired code")
    user.hashed_password = hash_password(body.new_password)
    user.reset_code = None
    db.commit()
    return {"message": "Password updated"}
