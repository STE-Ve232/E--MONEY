from flask import Blueprint, jsonify
from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, PayoutInstruction  # Assuming your User model is in models.py
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

@bp.route("/users", methods=["GET"])
@admin_required()
def get_all_users():
    """
    Fetches a list of all users in the system.
    An admin-only action.
    """
    try:
        users = User.query.all()
        # Serialize user data (excluding sensitive info like password hashes)
        user_list = [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "is_active": user.is_active,
                "created_at": user.created_at.isoformat()
            } for user in users
        ]
        return jsonify(users=user_list), 200
    except Exception as e:
        # In a real app, you would log this error
        return jsonify({"error": "Failed to fetch users"}), 500

