import os

class Config:
    # Ensure this line starts at the very beginning (no indentation)
    PAYOUT_WEBHOOK_PATH = os.getenv(
        "PAYOUT_WEBHOOK_PATH", "/api/v1/payout/webhook"
    )
    # Add other configuration variables here
    # Secrets for payment providers, loaded from environment variables
    FLUTTERWAVE_SECRET = os.getenv("FLUTTERWAVE_SECRET", "")
    PAYSTACK_SECRET = os.getenv("PAYSTACK_SECRET", "")
    CELLULANT_SECRET = os.getenv("CELLULANT_SECRET", "")
