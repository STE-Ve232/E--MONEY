from extensions import db
from models import Account, LedgerEntry, AuditLog
from services.ledger_service import create_double_entry
from config import Config
from decimal import Decimal
import uuid
from services.aggregator_clients import FlutterwaveClient, PaystackClient
from tasks.tasks_deposit import process_deposit_task


def new_tx_ref(prefix="DEPOSIT"):
    return f"{prefix}-{uuid.uuid4().hex[:12].upper()}"


def initiate_deposit(user_id, amount, currency="KES", provider="flutterwave", metadata=None):
    """
    Initiate a deposit request. This will create a payment link or initiate the payment process.
    """
    amt = Decimal(str(amount))
    tx_ref = new_tx_ref()

    # Find or create user account
    account = Account.query.filter_by(user_id=user_id, currency=currency, account_type='user').first()
    if not account:
        account = Account(user_id=user_id, account_type='user', currency=currency)
        db.session.add(account)
        db.session.flush()

    # Initiate real deposit process with payment gateway
    if provider == "flutterwave":
        client = FlutterwaveClient()
        payment_response = client.initiate_payment(amt, currency, tx_ref, user_id)
    elif provider == "paystack":
        client = PaystackClient()
        payment_response = client.initiate_payment(amt, currency, tx_ref, user_id)
    else:
        raise ValueError("Unsupported payment provider")

    # Log the deposit initiation
    db.session.add(AuditLog(
        event_type='deposit.initiate',
        actor_user_id=user_id,
        target=str(account.id),
        details={'amount': str(amt), 'currency': currency, 'provider': provider, 'tx_ref': tx_ref, 'payment_link': payment_response.get('link')}
    ))

    db.session.commit()

    return {"tx_ref": tx_ref, "status": "pending", "amount": str(amt), "currency": currency, "payment_link": payment_response.get('link')}


def process_deposit_webhook(provider, payload):
    """
    Process webhook from payment gateway to confirm deposit.
    """
    # This would validate the webhook signature and process the deposit
    # For now, it's a placeholder
    pass


def get_deposit_status(tx_ref):
    """
    Get the status of a deposit transaction.
    """
    # Query ledger or deposit table for status
    entry = LedgerEntry.query.filter_by(tx_ref=tx_ref, entry_type="deposit").first()
    if entry:
        return {"status": "completed", "amount": str(abs(entry.amount)), "currency": entry.currency}
    return {"status": "not_found"}
