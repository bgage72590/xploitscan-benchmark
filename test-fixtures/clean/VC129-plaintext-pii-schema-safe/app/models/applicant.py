from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, LargeBinary, String

from app.database import Base


class Applicant(Base):
    """Loan applicant submitted through the onboarding form.

    The SSN is encrypted with a KMS data key (app/crypto.py) before it is
    assigned; bank details live with Plaid and only the processor token is kept.
    """

    __tablename__ = "applicants"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    full_name = Column(String(255), nullable=False)
    ssn_encrypted = Column(LargeBinary, nullable=False)
    ssn_last4 = Column(String(4), nullable=False)
    plaid_processor_token = Column(String(128), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
