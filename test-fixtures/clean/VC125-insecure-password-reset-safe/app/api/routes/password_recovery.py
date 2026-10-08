import hashlib
import logging
import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, BackgroundTasks, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.database import get_db
from app.email import send_reset_email
from app.models import PasswordResetToken, User

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["auth"])

GENERIC = {"message": "If an account exists for that email, a reset link has been sent."}


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


@router.post("/forgot-password")
def forgot_password(
    body: ForgotPasswordRequest,
    background: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Send a password reset email.

    Returns 200 even when no user exists for the email, so the
    response never reveals which accounts are registered.
    """
    user = db.query(User).filter(User.email == body.email).first()
    if user is None:
        logger.info("Password reset requested but no user found for %s", body.email)
        return GENERIC
    token = secrets.token_urlsafe(32)
    db.add(
        PasswordResetToken(
            user_id=user.id,
            token_hash=hashlib.sha256(token.encode()).hexdigest(),
            expires_at=datetime.utcnow() + timedelta(minutes=30),
        )
    )
    db.commit()
    background.add_task(send_reset_email, user.email, token)
    return GENERIC
