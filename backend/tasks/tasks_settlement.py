from celery_app import celery
from extensions import db
from models import Settlement, LedgerEntry, Account
from services.ledger_service import create_double_entry
from datetime import datetime
import math

MAX_RETRIES = 5
BACKOFF = 10


@celery.task(bind=True, max_retries=MAX_RETRIES)
def process_settlement_task(self, settlement_id):
    try:
        settlement = db.session.get(Settlement, settlement_id)
        if not settlement:
            return {"error": "Settlement not found"}

        if settlement.status != "pending":
            return {"ok": True, "reason": f"Settlement already {settlement.status}"}

        # Assuming settlement.entries contains a list of LedgerEntry IDs or objects
        # that need to be aggregated and moved.
        # For simplicity, let's assume settlement.amount and settlement.currency
        # are already calculated and represent the net amount to be settled.

        # Debit the source account (e.g., a holding account)
        # Credit the destination account (e.g., a bank account or another internal account)

        # Example: Move funds from a holding account to a settlement account
        # These account IDs would typically be configured or determined by the settlement type
        source_account_id = settlement.source_account_id  # e.g., internal holding account
        destination_account_id = settlement.destination_account_id  # e.g., bank settlement account

        # Ensure accounts exist
        source_account = db.session.get(Account, source_account_id)
        destination_account = db.session.get(Account, destination_account_id)

        if not source_account or not destination_account:
            raise ValueError("Source or destination account for settlement not found.")
        if source_account.currency != settlement.currency or destination_account.currency != settlement.currency:
            raise ValueError("Account currencies do not match settlement currency.")

        legs = [
            {"account_id": source_account_id, "amount": -settlement.amount, "currency": settlement.currency},
            {"account_id": destination_account_id, "amount": settlement.amount, "currency": settlement.currency}
        ]

        # Create the double-entry transaction
        transaction_id = create_double_entry(legs, description=f"Settlement {settlement_id}")

        # Update settlement status
        settlement.status = "completed"
        settlement.transaction_id = transaction_id
        settlement.processed_at = datetime.utcnow()
        db.session.commit()

        return {"ok": True, "transaction_id": transaction_id}

    except Exception as e:
        db.session.rollback()
        self.retry(countdown=BACKOFF ** self.request.retries, exc=e)
        return {"error": str(e)}
