from extensions import db


class Device(db.Model):
    __tablename__ = 'devices'
    id = db.Column(db.BigInteger, primary_key=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey(
        'users.id'), nullable=False)
    device_id = db.Column(db.String(256), nullable=False, index=True)
    device_info = db.Column(db.JSON, default={})
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    last_seen = db.Column(db.DateTime, server_default=db.func.now())
