from extensions import db
from datetime import datetime


class Loan(db.Model):
    __tablename__ = 'loans'

    id = db.Column(db.BigInteger, primary_key=True)
    account_id = db.Column(db.BigInteger, db.ForeignKey(
        'accounts.id'), nullable=False, index=True)

    principal_amount = db.Column(db.Numeric(20, 6), nullable=False)
    interest_rate = db.Column(db.Numeric(5, 2), nullable=False)  # Annual rate
    currency = db.Column(db.String(8), nullable=False, default='KES')

    # pending, active, paid, defaulted
    status = db.Column(db.String(32), default='pending', index=True)

    disbursed_at = db.Column(db.DateTime, nullable=True)
    due_date = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)