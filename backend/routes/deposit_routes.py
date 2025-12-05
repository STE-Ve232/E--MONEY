from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from services.deposit_service import initiate_deposit, get_deposit_status
from schemas import DepositSchema
from marshmallow import ValidationError

bp = Blueprint("deposit", __name__, url_prefix="/api/deposit")

@bp.route("/initiate", methods=["POST"])
@jwt_required()
def initiate():
    try:
        data = DepositSchema().load(request.json)
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    user_id = get_jwt()['user_id']
    result = initiate_deposit(user_id, data)
    return jsonify(result), 201

@bp.route("/status/<tx_ref>", methods=["GET"])
@jwt_required()
def deposit_status(tx_ref):
    user_id = get_jwt()['user_id']
    status = get_deposit_status(tx_ref)
    return jsonify(status)


@bp.route("/webhook", methods=["POST"])
def deposit_webhook():
    # Webhook handler for payment gateway confirmations
    # This would verify the webhook signature and process the deposit
    # For now, it's a placeholder
    data = request.json
    provider = request.headers.get('X-Webhook-Provider', 'unknown')
    # Verify signature based on provider
    # Process the deposit confirmation
    return jsonify({"status": "ok"}), 200
