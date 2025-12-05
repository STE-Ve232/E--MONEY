from extensions import db
from models import PayoutInstruction
from services.ledger_service import create_double_entry
from config import Config
from decimal import Decimal
import uuid
from tasks.tasks_payout import execute_payout_task


def new_tx_ref(prefix="PAYOUT"):
    return f"{prefix}-{uuid.uuid4().hex[:12].upper()}"


def initiate_payout(account_id, destination, amount, currency="KES", provider_hint=None, metadata=None, actor_user_id=None):
    amt = Decimal(str(amount))
    tx_ref = new_tx_ref()
    # idempotency: caller can include metadata['external_ref'] to reuse; omitted for brevity
    inst = PayoutInstruction(tx_ref=tx_ref, provider=provider_hint, account_id=account_id,
                             destination=destination, amount=amt, currency=currency, status="pending", metadata=metadata or {})
    db.session.add(inst)
    db.session.flush()

    # lock funds: debit account, credit holding (reserve) account
    payout_holding_account_id = int(inst.metadata.get(
        "payout_holding_account") or Config.RESERVE_ACCOUNT_MAP.get(currency))
    legs = [
        {"account_id": account_id, "amount": -amt, "currency": currency},
        {"account_id": payout_holding_account_id,
            "amount": amt, "currency": currency}
    ]
    tx_ledger = create_double_entry(
        legs, entry_type="payout_lock", description=f"Lock funds for payout {tx_ref}", actor_user_id=actor_user_id, metadata={"payout_tx": tx_ref})
    inst.metadata = {**inst.metadata, "lock_tx_ref": tx_ledger}
    db.session.commit()

    # enqueue payout task (async)
    execute_payout_task.delay(inst.id, provider_hint)
    return inst
# PATH:backend\services\transfer_service.py
