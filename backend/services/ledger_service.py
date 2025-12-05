# backend/services/ledger_service.py
from models import db, Account, LedgerEntry, Transaction
from sqlalchemy.exc import SQLAlchemyError
from decimal import Decimal

def create_double_entry(
    from_account_id: int,
    to_account_id: int,
    amount: Decimal,
    currency: str,
    description: str = None,
    tx_ref: str = None
):
    """
    Performs a double-entry transaction between two accounts.
    """
    try:
        # Placeholder for actual logic.
        # In a real scenario, you would:
        # 1. Fetch accounts, lock them for update.
        # 2. Validate balances.
        # 3. Create debit and credit LedgerEntry records.
        # 4. Update account balances.
        # 5. Create a Transaction record.
        # For now, we'll just simulate success.

        # Example: Check if accounts exist (simplified)
        from_account = Account.query.get(from_account_id)
        to_account = Account.query.get(to_account_id)

        if not from_account or not to_account:
            raise ValueError("One or both accounts not found.")

        # Simulate transaction creation
        print(f"Simulating double entry: {amount} {currency} from {from_account_id} to {to_account_id}")
        return True, "Transaction simulated successfully."
    except SQLAlchemyError as e:
        db.session.rollback()
        return False, str(e)
    except Exception as e:
        return False, str(e)

def get_account_balance(account_id: int) -> Decimal:
    """
    Retrieves the current balance for a given account.
    """
    account = Account.query.get(account_id)
    if account:
        return account.balance
    return Decimal('0.00') # Or raise an error if account not found