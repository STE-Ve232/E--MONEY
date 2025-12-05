from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Account, User
from schemas import AccountSchema
from extensions import db
from services.account_service import create_account, get_user_accounts, get_account_details

bp = Blueprint("accounts", __name__, url_prefix="/api/accounts")

@bp.route("/create", methods=["POST"])
@jwt_required()
def create_new_account():
    user_id = get_jwt_identity()
    data = request.json
    try:
        account = create_account(user_id=user_id, account_name=data.get('account_name'), currency=data.get('currency'))
        return jsonify(AccountSchema().dump(account)), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Failed to create account"}), 500

@bp.route("/", methods=["GET"])
@jwt_required()
def get_accounts():
    user_id = get_jwt_identity()
    accounts = get_user_accounts(user_id)
    return jsonify(AccountSchema(many=True).dump(accounts)), 200

@bp.route("/<int:account_id>", methods=["GET"])
@jwt_required()
def get_single_account(account_id):
    user_id = get_jwt_identity()
    account = get_account_details(account_id, user_id)
    if account:
        return jsonify(AccountSchema().dump(account)), 200
    return jsonify({"error": "Account not found or unauthorized"}), 404
