from extensions import db
from sqlalchemy.dialects.postgresql import JSONB


class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    id = db.Column(db.BigInteger, primary_key=True)
    event_type = db.Column(db.String(128), nullable=False, index=True)
    actor_user_id = db.Column(db.BigInteger, nullable=True)
    target = db.Column(db.String(256), nullable=True)
    severity = db.Column(db.String(32), default='info')
    details = db.Column(JSONB, default={})
    created_at = db.Column(
        db.DateTime, server_default=db.func.now(), index=True)
    prev_hash = db.Column(db.String(128), nullable=True)
    row_hash = db.Column(db.String(128), nullable=True)
