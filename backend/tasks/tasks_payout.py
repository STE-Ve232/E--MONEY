from celery_app import celery
from extensions import db
from models import PayoutInstruction
from services.aggregator_clients import FlutterwaveClient, PaystackClient
# import from services.aggregator_clients import get_aggregator_client if False else None
import time
import math

MAX_RETRIES = 5
BACKOFF = 10


@celery.task(bind=True, max_retries=MAX_RETRIES)
def execute_payout_task(self, payout_id, provider_hint=None):
    try:
        inst = db.session.get(PayoutInstruction, payout_id)
        if not inst:
            return {"error": "not found"}
        if inst.status == "completed":
            return {"ok": True, "reason": "already completed"}

        provider = provider_hint or (inst.provider or "flutterwave")
        if provider == "flutterwave":
            client = FlutterwaveClient
        elif provider == "paystack":
            client = PaystackClient
        else:
            client = FlutterwaveClient

        payload = {
            "account_bank": inst.destination.get("account_bank", "MPESA"),
            "account_number": inst.destination.get("phone") or inst.destination.get("account_number"),
            "amount": float(inst.amount),
            "currency": inst.currency,
            "narration": inst.payout_metadata.get("narration", f"Payout {inst.tx_ref}"),
            "reference": inst.tx_ref
        }
        resp = client.create_payout(payload)
        inst.attempts = (inst.attempts or 0) + 1
        if resp.get("ok"):
            inst.provider_ref = resp.get("provider_ref")
            inst.status = "in_progress"
            inst.payout_metadata = {**(inst.payout_metadata or {}),
                             "provider_raw": resp.get("raw")}
        else:
            inst.last_error = str(resp.get("raw") or resp)
            inst.status = "pending" # Will be marked as failed only after all retries
            # raise to retry
            raise Exception("payout failed")
        db.session.add(inst)
        db.session.commit()
        return {"ok": True, "payout_id": inst.id}
    except Exception as exc:
        try:            
            countdown = BACKOFF * (2 ** self.request.retries)
            raise self.retry(exc=exc, countdown=countdown)
        except Exception:
            # final failure update
            inst = db.session.get(PayoutInstruction, payout_id)
            if inst:
                inst.status = "failed"
                inst.last_error = str(exc)
                db.session.add(inst)
                db.session.commit()
            raise
