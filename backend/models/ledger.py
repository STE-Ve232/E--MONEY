# backend/models/ledger.py
from extensions import db
from datetime import datetime


class LedgerEntry(db.Model):
    __tablename__ = "ledger_entries"
    id = db.Column(db.BigInteger, primary_key=True)
    account_id = db.Column(db.BigInteger, nullable=False, index=True)
    transaction_id = db.Column(db.BigInteger, nullable=False, index=True)
    # 'debit' or 'credit'
    entry_type = db.Column(db.String(10), nullable=False)
    amount = db.Column(db.Numeric(20, 6), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)