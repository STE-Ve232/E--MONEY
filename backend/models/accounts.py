# backend/models/accounts.py
from extensions import db
from datetime import datetime


class Account(db.Model):
    __tablename__ = "accounts"
    id = db.Column(db.BigInteger, primary_key=True)
    user_id = db.Column(db.BigInteger, nullable=False, index=True)
    # e.g., NGN_DEFAULT, USD_DEFAULT
    account_type = db.Column(db.String(64), nullable=False)
    balance = db.Column(db.Numeric(20, 6), default=0.0)
    currency = db.Column(db.String(8), nullable=False)
    status = db.Column(db.String(32), default="active")  # active, inactive, frozen
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)