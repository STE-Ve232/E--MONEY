from extensions import db
from models.user import User


# minimal: store KYC payload in user.kyc_data and set kyc_status


def submit_kyc(user, kyc_payload):
    user.kyc_data = {**(user.kyc_data or {}), **kyc_payload}
    user.kyc_status = 'pending'
    db.session.add(user)
    db.session.commit()
    # add audit log
    import models.audit
