from extensions import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.BigInteger, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=True)
    phone = db.Column(db.String(32), unique=True, nullable=True)

    password_hash = db.Column(db.String(200), nullable=True)

    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)

    # none, pending, verified, rejected
    kyc_status = db.Column(db.String(32), default="none")
    kyc_data = db.Column(JSONB, default=dict)       # FIXED mutable default

    two_fa_enabled = db.Column(db.Boolean, default=False)
    two_fa_secret = db.Column(db.String(64), nullable=True)

    wallet_balance = db.Column(db.Numeric(precision=15, scale=2), default=0)

    role = db.Column(db.String(32), default="user")  # user, admin, super_admin

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f"<User {self.username}>"
