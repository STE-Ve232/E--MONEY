# backend/models/deposit.py
from extensions import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB

class Deposit(db.Model):
    __tablename__ = "deposits"
    id = db.Column(db.BigInteger, primary_key=True)
    tx_ref = db.Column(db.String(128), unique=True, nullable=False, index=True)
    provider = db.Column(db.String(64), nullable=True)
    provider_ref = db.Column(db.String(128), nullable=True)
    account_id = db.Column(db.BigInteger, nullable=False)
    amount = db.Column(db.Numeric(20, 6), nullable=False)
    currency = db.Column(db.String(8), nullable=False)
    status = db.Column(db.String(32), default="pending") # pending, completed, failed
    deposit_metadata = db.Column(JSONB, default={})
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)