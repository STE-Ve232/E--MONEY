# backend/models/payout.py
from extensions import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB


class PayoutInstruction(db.Model):
    __tablename__ = "payout_instructions"
    id = db.Column(db.BigInteger, primary_key=True)
    tx_ref = db.Column(db.String(128), unique=True,
                       nullable=False, index=True)  # local txref
    # 'flutterwave'|'paystack'|'cellulant'
    provider = db.Column(db.String(64), nullable=True)
    # aggregator transaction id
    provider_ref = db.Column(db.String(128), nullable=True)
    # our ledger account id debited
    account_id = db.Column(db.BigInteger, nullable=False)
    # phone/account details for payout
    destination = db.Column(db.JSON, default={})
    amount = db.Column(db.Numeric(20, 6), nullable=False)
    currency = db.Column(db.String(8), nullable=False)
    # pending,in_progress,completed,failed,refunded
    status = db.Column(db.String(32), default="pending")
    attempts = db.Column(db.Integer, default=0)
    last_error = db.Column(db.Text, nullable=True)
    payout_metadata = db.Column(JSONB, default={})
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
