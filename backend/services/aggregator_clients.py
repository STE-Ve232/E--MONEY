import requests
from config import Config


def _post(url, headers, json, timeout=30):
    r = requests.post(url, headers=headers, json=json, timeout=timeout)
    r.raise_for_status()
    return r.json()

# Flutterwave


class FlutterwaveClient:
    base = "https://api.flutterwave.com/v3"
    secret = Config.FLUTTERWAVE_SECRET

    @classmethod
    def headers(cls):
        return {"Authorization": f"Bearer {cls.secret}", "Content-Type": "application/json"}

    @classmethod
    def create_payout(cls, payload):
        # Flutterwave transfers endpoint; map fields
        url = f"{cls.base}/transfers"
        body = {
            "account_bank": payload.get("account_bank", "MPESA"),
            "account_number": payload.get("account_number"),
            "amount": str(payload.get("amount")),
            "currency": payload.get("currency", "KES"),
            "narration": payload.get("narration", ""),
            "reference": payload.get("reference")
        }
        resp = _post(url, cls.headers(), body)
        ok = resp.get("status") in ("success", True)
        return {"ok": ok, "provider_ref": resp.get("data", {}).get("id") or resp.get("data", {}).get("reference"), "raw": resp}

# Paystack (example - you likely need recipient management)


class PaystackClient:
    base = "https://api.paystack.co"
    secret = Config.PAYSTACK_SECRET

    @classmethod
    def headers(cls):
        return {"Authorization": f"Bearer {cls.secret}", "Content-Type": "application/json"}

    @classmethod
    def create_payout(cls, payload):
        # Paystack transfer create (requires recipient code normally)
        url = f"{cls.base}/transfer"
        body = {
            "source": "balance",
            "amount": int(float(payload.get("amount"))*100),
            "recipient": payload.get("recipient"),
            "reason": payload.get("narration"),
            "reference": payload.get("reference")
        }
        resp = _post(url, cls.headers(), body)
        return {"ok": resp.get("status") is True, "provider_ref": resp.get("data", {}).get("reference"), "raw": resp}

    @classmethod
    def initiate_deposit(cls, payload):
        # Paystack initialize transaction
        url = f"{cls.base}/transaction/initialize"
        body = {
            "email": payload.get("email"),
            "amount": int(float(payload.get("amount"))*100),
            "reference": payload.get("reference"),
            "callback_url": payload.get("callback_url")
        }
        resp = _post(url, cls.headers(), body)
        return {
            "ok": resp.get("status") is True,
            "payment_url": resp.get("data", {}).get("authorization_url"),
            "provider_ref": resp.get("data", {}).get("reference"),
            "raw": resp
        }


# Cellulant (placeholder - implement based on their API)


class CellulantClient:
    base = "https://api.cellulant.com"  # Placeholder URL
    secret = Config.CELLULANT_SECRET

    @classmethod
    def headers(cls):
        return {"Authorization": f"Bearer {cls.secret}", "Content-Type": "application/json"}

    @classmethod
    def initiate_deposit(cls, payload):
        # Implement Cellulant deposit initiation
        # This is a placeholder - actual implementation depends on Cellulant's API
        return {"ok": False, "error": "Not implemented yet"}
