# backend/routes/aggregator_routes.py
from flask import Blueprint, request, jsonify
from extensions import db
from services.payout_service import initiate_payout
from models.payout import PayoutInstruction
from services.aggregator_clients import get_aggregator_client
from utils.webhook import verify_flutterwave_signature, verify_paystack_signature, verify_cellulant_signature
from datetime import datetime

bp = Blueprint('aggregator', __name__, url_prefix='/api/aggregator')


@bp.route('/payout', methods=['POST'])
def create_payout():
    """
    Body: {
      "account_id": 123,
      "destination": {"phone":"2547..."},
      "amount": 1000,
      "currency":"KES",
      "provider":"flutterwave"  # optional hint
    }
    """
    data = request.json
    inst = initiate_payout(
        account_id=int(data['account_id']),
        destination=data['destination'],
        amount=data['amount'],
        currency=data.get('currency', 'KES'),
        provider_hint=data.get('provider'),
        metadata=data.get('metadata', {}),
        actor_user_id=data.get('actor_user_id')
    )
    return jsonify({"ok": True, "payout_id": inst.id, "tx_ref": inst.tx_ref})


@bp.route('/webhook', methods=['POST'])
def webhook():
    # determine provider by header, path, or payload. We'll try to auto-detect.
    hdrs = request.headers
    raw = request.get_json(silent=True) or {}
    # Try Flutterwave
    if 'verif-hash' in hdrs or 'x-flutterwave-signature' in hdrs:
        if not verify_flutterwave_signature(request):
            return jsonify({"error": "invalid signature"}), 403
        # parse payload to find our reference
        data = raw.get('data') or raw
        ref = data.get('reference') or data.get(
            'id') or data.get('transaction_reference')
        # find matching PayoutInstruction by tx_ref or provider_ref
        inst = None
        if ref:
            inst = db.session.query(PayoutInstruction).filter(
                (PayoutInstruction.tx_ref == ref) | (PayoutInstruction.provider_ref == str(ref))).first()
        # map event status
        status = data.get('status') or raw.get('status')
        with db.session.begin():
            if inst:
                if status in ('successful', 'SUCCESS', 'success'):
                    inst.status = 'completed'
                    inst.provider_ref = inst.provider_ref or str(
                        data.get('id') or data.get('reference'))
                elif status in ('failed', 'FAILED', 'error'):
                    inst.status = 'failed'
                    inst.last_error = str(data)
                else:
                    inst.status = 'in_progress'
                inst.metadata = {**(inst.metadata or {}), "webhook": raw}
                db.session.add(inst)
        return jsonify({"ok": True})

    # Try Paystack
    if 'x-paystack-signature' in hdrs:
        if not verify_paystack_signature(request):
            return jsonify({"error": "invalid signature"}), 403
        data = raw.get('data') or raw
        ref = data.get('reference') or data.get('id')
        inst = db.session.query(PayoutInstruction).filter(
            (PayoutInstruction.tx_ref == ref) | (PayoutInstruction.provider_ref == str(ref))).first()
        with db.session.begin():
            if inst:
                if data.get('status') == 'success':
                    inst.status = 'completed'
                elif data.get('status') in ('failed', 'error'):
                    inst.status = 'failed'
                    inst.last_error = str(data)
                else:
                    inst.status = 'in_progress'
                inst.metadata = {**(inst.metadata or {}), "webhook": raw}
                db.session.add(inst)
        return jsonify({"ok": True})

    # generic fallback for cellulant or others
    # optional: implement verify_cellulant_signature
    try:
        data = raw.get('data') or raw
        ref = data.get('reference') or data.get('id')
        inst = db.session.query(PayoutInstruction).filter(
            (PayoutInstruction.tx_ref == ref) | (PayoutInstruction.provider_ref == str(ref))).first()
        if inst:
            with db.session.begin():
                st = data.get('status') or raw.get('status')
                if st in ('successful', 'SUCCESS', 'success'):
                    inst.status = 'completed'
                elif st in ('failed', 'FAILED'):
                    inst.status = 'failed'
                else:
                    inst.status = 'in_progress'
                inst.metadata = {**(inst.metadata or {}), "webhook": raw}
                db.session.add(inst)
        return jsonify({"ok": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route('/payout/<tx_ref>', methods=['GET'])
def get_payout(tx_ref):
    inst = db.session.query(PayoutInstruction).filter_by(tx_ref=tx_ref).first()
    if not inst:
        return jsonify({"error": "not found"}), 404
    # if provider_ref exists and still in_progress, optionally poll the aggregator
    if inst.provider_ref and inst.status in ("in_progress", "pending"):
        try:
            client = get_aggregator_client(inst.provider or "flutterwave")
            stat = client.get_payout_status(inst.provider_ref)
            # optionally normalize into inst.status
            # omitted: map status
        except Exception:
            stat = None
    else:
        stat = None
    return jsonify({
        "id": inst.id,
        "tx_ref": inst.tx_ref,
        "status": inst.status,
        "provider": inst.provider,
        "provider_ref": inst.provider_ref,
        "amount": str(inst.amount),
        "currency": inst.currency,
        "metadata": inst.metadata,
        "provider_status_raw": stat
    })
