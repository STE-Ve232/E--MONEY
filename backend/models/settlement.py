# backend/models/settlement.py
from extensions import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB


class Settlement(db.Model):
    __tablename__ = "settlements"
    id = db.Column(db.BigInteger, primary_key=True)
    tx_ref = db.Column(db.String(128), unique=True, nullable=False, index=True)
    account_id = db.Column(db.BigInteger, nullable=False)
    amount = db.Column(db.Numeric(20, 6), nullable=False)
    currency = db.Column(db.String(8), nullable=False)
    status = db.Column(db.String(32), default="pending")  # pending, completed
    settlement_metadata = db.Column(JSONB, default={})
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)