from extensions import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB


class FraudAlert(db.Model):
    __tablename__ = "fraud_alerts"
    id = db.Column(db.BigInteger, primary_key=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey('users.id'), nullable=False)
    transaction_id = db.Column(db.BigInteger, nullable=True)
    alert_type = db.Column(db.String(128), nullable=False)
    severity = db.Column(db.String(32), default='medium')
    description = db.Column(db.Text)
    metadata = db.Column(JSONB, default={})
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
