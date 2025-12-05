# backend/utils/webhook.py
import hmac
import hashlib
from config import Config


def verify_flutterwave_signature(request):
    # Flutterwave provides an x-flutterwave-signature header with HMAC SHA256 using your secret
    sig = request.headers.get(
        "verif-hash") or request.headers.get("x-flutterwave-signature")
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
    secret = Config.PAYSTACK_SECRET
    body = request.get_data()
    computed = hmac.new(secret.encode(), body, hashlib.sha512).hexdigest()
    return hmac.compare_digest(computed, sig)

# Cellulant signature verifies differently; create accordingly


def verify_cellulant_signature(request):
    # stub: if they provide an HMAC header, verify similarly
    return True
