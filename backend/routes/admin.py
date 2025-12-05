from flask import Blueprint, jsonify
from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, LedgerEntry, Settlement
from extensions import db

bp = Blueprint("admin", __name__, url_prefix="/api/admin")

def admin_required():
    """
    A custom decorator to protect routes that require 'admin' or 'super_admin' role.
    """
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            if user and user.role in ['admin', 'super_admin']:
                return fn(*args, **kwargs)
            else:
                return jsonify({"error": "Admin privileges required"}), 403
        return decorator
    return wrapper

@bp.route("/transactions", methods=["GET"])
@admin_required()
def get_transactions():
    try:
        transactions = LedgerEntry.query.order_by(LedgerEntry.created_at.desc()).all()
        transaction_list = [
            {
                "id": tx.id,
                "account_id": tx.account_id,
                "amount": str(tx.amount),
                "currency": tx.currency,
                "entry_type": tx.entry_type,
                "description": tx.description,
                "created_at": tx.created_at.isoformat()
            } for tx in transactions
        ]
        return jsonify(transactions=transaction_list), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch transactions"}), 500

@bp.route("/payouts", methods=["GET"])
@admin_required()
def get_payouts():
    try:
        payouts = Settlement.query.order_by(Settlement.created_at.desc()).all()
        payout_list = [
            {
                "id": p.id,
                "amount": str(p.amount),
                "currency": p.currency,
                "status": p.status,
                "created_at": p.created_at.isoformat()
            } for p in payouts
        ]
        return jsonify(payouts=payout_list), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch payouts"}), 500
