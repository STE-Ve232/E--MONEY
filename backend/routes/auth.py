from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
import re
from functools import wraps
from schemas import UserRegistrationSchema
from services.auth_service import register_user, authenticate_user, re_authenticate_admin
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from models import User # Assuming your User model is in models.py

bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def super_admin_required():
    """
    A custom decorator to protect routes that require a 'super_admin' role.
    """
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            if user and user.role == 'super_admin':
                return fn(*args, **kwargs)
            else:
                return jsonify({"error": "Super admin privileges required"}), 403
        return decorator
    return wrapper

def is_strong_password(password):
    """Checks if the provided password is strong enough.
    A strong password has at least 8 characters, including uppercase, lowercase, digit, and special character.
    """
    if (len(password) < 8 or
            not re.search(r"[a-z]", password) or
            not re.search(r"[A-Z]", password) or
            not re.search(r"\d", password) or
            not re.search(r"[\W_]", password)): # \W is non-alphanumeric, _ is included for underscore
        return False, "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character."
    return True, ""

@bp.route("/register", methods=["POST"])
def register():
    schema = UserRegistrationSchema()
    try:
        data = schema.load(request.json)

        is_strong, message = is_strong_password(data['password'])
        if not is_strong:
            return jsonify({"error": message}), 400

        result = register_user(data)
        return jsonify(result), 201
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400

@bp.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.get_json()
    email_or_username = data.get('email_or_username')
    password = data.get('password')

    if not email_or_username or not password:
        return jsonify({"error": "Email/Username and password are required"}), 400

    auth_result = authenticate_user(email_or_username, password)
    if auth_result:
        user = User.query.filter(
            (User.email == email_or_username) |
            (User.username == email_or_username)
        ).first()
        if user and user.role in ['admin', 'super_admin']:
            return jsonify(auth_result), 200
        else:
            return jsonify({"error": "Admin privileges required"}), 403
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# --- NEW SUPER ADMIN ENDPOINT ---
@bp.route("/admin/reserve/debit", methods=["POST"])
@super_admin_required()
def debit_reserve_account():
    """Debits the main reserve account. This is a highly privileged action."""
    data = request.get_json()
    amount = data.get('amount')
    reason = data.get('reason')

    if not isinstance(amount, (int, float)) or amount <= 0:
        return jsonify({"error": "Invalid amount specified"}), 400
    
    print(f"SUPER ADMIN ACTION: Debiting reserve account by {amount} for reason: '{reason}'")
    return jsonify({"success": True, "message": f"Reserve account debited by {amount}"}), 200