from models import Loan, User
from extensions import db
from flask_jwt_extended import get_jwt_identity
from flask import jsonify

def apply_loan(data):
    """Apply for a loan"""
    user_id = get_jwt_identity()

    # Validate user exists
    user = User.query.get(user_id)
    if not user:
        return {"error": "User not found"}, 404

    # Create loan application
    loan = Loan(
        user_id=user_id,
        amount=data['amount'],
        purpose=data['purpose']
    )

    db.session.add(loan)
    db.session.commit()

    return {
        "message": "Loan application submitted successfully",
        "loan": {
            "id": loan.id,
            "amount": str(loan.amount),
            "purpose": loan.purpose,
            "status": loan.status,
            "applied_at": loan.applied_at.isoformat()
        }
    }, 201
