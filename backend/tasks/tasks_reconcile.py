from tasks.celery_app import celery
from extensions import db
from models import PayoutInstruction, DepositInstruction
from services.aggregator_clients import FlutterwaveClient, PaystackClient
import time
import math

MAX_RETRIES = 5
BACKOFF = 10


@celery.task(bind=True, max_retries=MAX_RETRIES)
def reconcile_payout_task(self, payout_id, provider_hint=None):
    try:
        inst = db.session.get(PayoutInstruction, payout_id)
        if not inst:
            return {"error": "Payout instruction not found"}
        if inst.status == "completed":
            return {"ok": True, "reason": "Payout already completed"}

        provider = provider_hint or (inst.provider or "flutterwave")
        if provider == "flutterwave":
            client = FlutterwaveClient
        elif provider == "paystack":
            client = PaystackClient
        else:
            raise ValueError(f"Unsupported provider: {provider}")

        # Assuming a method to check payout status with the provider
        # This is a placeholder and needs actual implementation based on provider API
        status_resp = client.get_payout_status(inst.provider_ref)

        if status_resp.get("ok"):
            provider_status = status_resp.get("status")
            if provider_status == "successful":
                inst.status = "completed"
                # TODO: Release funds from holding account to actual settlement
            elif provider_status == "failed":
                inst.status = "failed"
                inst.last_error = status_resp.get("message", "Provider reported failed")
                # TODO: Reverse funds from holding account back to user account
            else:
                # Still pending or in progress, retry later
                raise Exception(f"Payout still in progress: {provider_status}")
        else:
            raise Exception(f"Failed to get status from provider: {status_resp.get('error')}")

        db.session.add(inst)
        db.session.commit()
        return {"ok": True, "payout_id": inst.id, "status": inst.status}

    except Exception as exc:
        countdown = BACKOFF * (2 ** self.request.retries)
        # self.retry raises a Retry exception, so the task will be tried again.
        raise self.retry(exc=exc, countdown=countdown)