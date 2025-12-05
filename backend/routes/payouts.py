from flask import Blueprint, request, jsonify
from schemas import PayoutCreateSchema
from marshmallow import ValidationError
from services.payout_service import initiate_payout
from extensions import limiter
from config import Config
from services.aggregator_clients import FlutterwaveClient, PaystackClient
from models import PayoutInstruction
from extensions import db
from utils import verify_flw_signature, verify_paystack_signature

bp = Blueprint("payouts", __name__, url_prefix="/api/payouts")


@bp.route("/create", methods=["POST"])
@limiter.limit("60/hour")
def create_payout():
    try:
        data = PayoutCreateSchema().load(request.json)
    except ValidationError as e:
        return jsonify({"error": e.messages}), 400
    inst = initiate_payout(
        account_id=data['account_id'],
        destination=data['destination'],
        amount=data['amount'],
        currency=data.get('currency'),
        provider_hint=data.get('provider'),
        metadata={}
    )
    return jsonify({"ok": True, "payout_id": inst.id, "tx_ref": inst.tx_ref})


@bp.route("/webhook", methods=["POST"])
def webhook():
    # try identify provider by headers
    hdrs = request.headers
    raw = request.get_json(silent=True) or {}
    # Flutterwave verification header 'verif-hash'
    if 'verif-hash' in hdrs:
        if not verify_flw_signature(request):
            return jsonify({"error": "invalid signature"}), 403
        data = raw.get('data') or raw
        ref = data.get('reference') or data.get('id')
        inst = db.session.query(PayoutInstruction).filter(
            (PayoutInstruction.tx_ref == ref) | (PayoutInstruction.provider_ref == str(ref))).first()
        if inst:
            if data.get('status') in ('successful', 'success', 'SUCCESS'):
                inst.status = 'completed'
            elif data.get('status') in ('failed', 'failed'):
                inst.status = 'failed'
                inst.last_error = str(data)
            else:
                inst.status = 'in_progress'
            inst.provider_ref = inst.provider_ref or (
                data.get('id') or data.get('reference'))
            inst.metadata = {**(inst.metadata or {}), "webhook": raw}
            db.session.add(inst)
            db.session.commit()
        return jsonify({"ok": True})

    # Paystack
    if 'x-paystack-signature' in hdrs:
        if not verify_paystack_signature(request):
            return jsonify({"error": "invalid signature"}), 403
        data = raw.get('data') or raw
        ref = data.get('reference') or data.get('id')
        inst = db.session.query(PayoutInstruction).filter(
            (PayoutInstruction.tx_ref == ref) | (PayoutInstruction.provider_ref == str(ref))).first()
        if inst:
            st = data.get('status')
            if st == 'success':
                inst.status = 'completed'
            elif st in ('failed', 'error'):
                inst.status = 'failed'
            else:
                inst.status = 'in_progress'
            inst.metadata = {**(inst.metadata or {}), "webhook": raw}
            db.session.add(inst)
            db.session.commit()
        return jsonify({"ok": True})

    # fallback
    return jsonify({"ok": False, "reason": "unknown provider"}), 400
