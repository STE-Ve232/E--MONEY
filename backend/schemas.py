# ==========================
# FILE: schemas.py (FULL)
# ==========================
from marshmallow import Schema, fields

class UserRegistrationSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)

class UserLoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)

class LedgerCreateSchema(Schema):
    account_id = fields.Int(required=True)
    entry_type = fields.Str(required=True)
    amount = fields.Decimal(required=True, as_string=True)
    currency = fields.Str(load_default="KES")
    description = fields.Str(load_default=None)
    meta = fields.Dict(load_default=dict)

class DepositCreateSchema(Schema):
    amount = fields.Decimal(required=True, as_string=True)
    currency = fields.Str(load_default="KES")
    provider = fields.Str(load_default="flutterwave")
    extra_data = fields.Dict(load_default=dict)

class PayoutCreateSchema(Schema):
    account_id = fields.Int(required=True)
    destination = fields.Dict(required=True)
    amount = fields.Decimal(required=True, as_string=True)
    currency = fields.Str(load_default="KES")
    provider = fields.Str(load_default=None)
    extra_data = fields.Dict(load_default={})  # <--- FIXED
class AdminUserSchema(Schema):
    id = fields.Int()
    email = fields.Email()
    is_admin = fields.Bool()
    created_at = fields.DateTime()

class TransferSchema(Schema):
    from_account_id = fields.Int(required=True)
    to_account_id = fields.Int(required=True)
    amount = fields.Decimal(required=True, as_string=True)
    currency = fields.Str(required=True)
    created_at = fields.DateTime()