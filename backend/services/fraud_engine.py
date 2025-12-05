import logging
from typing import Dict, Any
from models import User, Transaction, FraudAlert
from extensions import db
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class FraudEngine:
    def __init__(self):
        self.rules = [
            self._rule_high_value_transaction,
            self._rule_multiple_failed_transactions,
            self._rule_unusual_location, # Placeholder, requires location data
            self._rule_rapid_transactions # Placeholder, requires transaction history
        ]

    def _rule_high_value_transaction(self, user: User, transaction_data: Dict[str, Any]) -> (bool, str):
        """Flag transactions above a certain threshold."""
        threshold = 10000  # Example: $10,000
        if transaction_data.get('amount', 0) > threshold:
            return True, f"High value transaction detected: {transaction_data.get('amount')}"
        return False, ""

    def _rule_multiple_failed_transactions(self, user: User, transaction_data: Dict[str, Any]) -> (bool, str):
        """Flag if a user has multiple failed transactions recently."""
        time_window = timedelta(minutes=30)
        failed_transactions_count = db.session.query(Transaction).filter(
            Transaction.user_id == user.id,
            Transaction.status == 'failed',
            Transaction.created_at >= datetime.utcnow() - time_window
        ).count()

        if failed_transactions_count >= 3:  # Example: 3 or more failed transactions in 30 minutes
            return True, f"Multiple failed transactions detected ({failed_transactions_count}) within {time_window}."
        return False, ""

    def _rule_unusual_location(self, user: User, transaction_data: Dict[str, Any]) -> (bool, str):
        """Placeholder for checking unusual transaction locations."""
        # This would require integrating with IP geolocation or user's usual locations
        # For now, it's a dummy rule.
        # if transaction_data.get('ip_address') and self._is_unusual_ip(user, transaction_data['ip_address']):
        #     return True, "Transaction from unusual location detected."