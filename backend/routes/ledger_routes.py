from flask import Blueprint, request, jsonify
from schemas import TransferSchema
from marshmallow import ValidationError
from services.ledger_service import create_double_entry, get_account_balance
from extensions import limiter
from decimal import Decimal
from models import Account
from config import Config

bp = Blueprint("ledger", __name__, url_prefix="/api/ledger")


@bp.route("/transfer", methods=["POST"])
@limiter.limit("30/hour")
def transfer():
    try:
        data = TransferSchema().load(request.json)
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    from_acc = Account.query.get(data['from_account_id'])
    to_acc = Account.query.get(data['to_account_id'])
    if not from_acc or not to_acc:
        return jsonify({"error": "Account not found"}), 404
    currency = data.get('currency', 'EMC')
    amount = Decimal(str(data['amount']))
    # check balance
    bal = get_account_balance(from_acc.id)
    if Decimal(str(bal)) < amount:
        return jsonify({"error": "Insufficient funds"}), 400
    legs = [
        {"account_id": from_acc.id, "amount": -amount, "currency": currency},
        {"account_id": to_acc.id, "amount": amount, "currency": currency}
    ]
    fee = Decimal('0')
    if amount > Decimal('100'):
        fee = (amount * Decimal('0.001')).quantize(Decimal('0.01'))
        reserve_id = Config.RESERVE_ACCOUNT_MAP.get(currency)
        legs[0]['amount'] = legs[0]['amount'] - fee
        legs.append({"account_id": reserve_id,
                    "amount": fee, "currency": currency})
    tx_ref = create_double_entry(
        legs, entry_type="transfer", description=data.get('description'))
    return jsonify({"ok": True, "tx_ref": tx_ref, "fee": str(fee)})
