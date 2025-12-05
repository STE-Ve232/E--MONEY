import hmac
import hashlib
from flask import request
from config import Config


def verify_flw_signature(request):
    sig = request.headers.get("verif-hash")
    if not sig:
        return False
    body = request.get_data()
    secret = Config.FLUTTERWAVE_SECRET
    computed = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(computed, sig)


def verify_paystack_signature(request):
    sig = request.headers.get("x-paystack-signature")
    if not sig:
        return False
    body = request.get_data()
    secret = Config.PAYSTACK_SECRET
    computed = hmac.new(secret.encode(), body, hashlib.sha512).hexdigest()
    return hmac.compare_digest(computed, sig)
