from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String

from app.database import Base


class Applicant(Base):
    """Loan applicant submitted through the onboarding form."""

    __tablename__ = "applicants"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    full_name = Column(String(255), nullable=False)
    ssn = Column(String(11), nullable=False)
    bank_account_number = Column(String(34), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
