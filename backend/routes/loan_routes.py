from flask import Blueprint, request, jsonify
from services.loan_service import (
    apply_for_loan,
    get_loan_by_id,
    get_all_loans
)

bp = Blueprint('loans', __name__, url_prefix='/api/v1/loans')

# Routes for loan functionality will be added here