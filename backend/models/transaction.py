# backend/models/transaction.py
from extensions import db
from datetime import datetime


class Transaction(db.Model):
    __tablename__ = "transactions"
    id = db.Column(db.BigInteger, primary_key=True)
    account_id = db.Column(db.BigInteger, nullable=False, index=True)
    # debit|credit
    type = db.Column(db.String(16), nullable=False)
    amount = db.Column(db.Numeric(20, 6), nullable=False)
    currency = db.Column(db.String(8), nullable=False)
    balance_before = db.Column(db.Numeric(20, 6), nullable=False)
    balance_after = db.Column(db.Numeric(20, 6), nullable=False)
    description = db.Column(db.Text, nullable=True)
    # reference to deposit,payout,settlement etc
    tx_ref = db.Column(db.String(128), index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)