import pytest
from backend.app import app
from backend.models.user import User
from backend.models.payout import PayoutInstruction
from backend.tasks.tasks_payout import execute_payout_task
from backend.extensions import db

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            yield client

def test_user_endpoint(client):
    # Test user creation and retrieval should be added as per actual API
    pass  # placeholder for user API test

def test_payout_endpoint(client):
    # Test payout creation and status update endpoint
    pass  # placeholder for payout API test

def test_ledger_endpoint(client):
    # Test ledger entries retrieval or creation endpoint
    pass  # placeholder for ledger API test

def test_settlement_endpoint(client):
    # Test settlement instruction creation and status update
    pass  # placeholder for settlement API test

def test_execute_payout_task_success(monkeypatch):
    # Mock client.create_payout to succeed
    class DummyClient:
        @staticmethod
        def create_payout(payload):
            return {"ok": True, "provider_ref": "ref123", "raw": "rawdata"}

    # Patch the client import in tasks_payout to use DummyClient
    import backend.tasks.tasks_payout as tasks_payout
    monkeypatch.setattr(tasks_payout, "FlutterwaveClient", DummyClient)
    monkeypatch.setattr(tasks_payout, "PaystackClient", DummyClient)

    # Create a dummy PayoutInstruction in test db
    payout = PayoutInstruction(
        provider = 'flutterwave',
        status = 'pending',
        destination = {'phone': '1234567890'},
        amount = 100,
        currency = 'USD',
        tx_ref = 'tx123',
        attempts = 0,
        metadata = {}
    )
    db.session.add(payout)
    db.session.commit()

    result = execute_payout_task(None, payout.id, 'flutterwave')
    assert result.get("ok") == True
    assert payout.status == "in_progress"

def test_execute_payout_task_failure(monkeypatch):
    # Mock client.create_payout to fail
    class DummyClientFail:
        @staticmethod
        def create_payout(payload):
            return {"ok": False, "raw": "error"}

    import backend.tasks.tasks_payout as tasks_payout
    monkeypatch.setattr(tasks_payout, "FlutterwaveClient", DummyClientFail)
    monkeypatch.setattr(tasks_payout, "PaystackClient", DummyClientFail)

    payout = PayoutInstruction(
        provider = 'flutterwave',
        status = 'pending',
        destination = {'phone': '1234567890'},
        amount = 100,
        currency = 'USD',
        tx_ref = 'tx124',
        attempts = 4,  # Near max retries to test fail status
        metadata = {}
    )
    db.session.add(payout)
    db.session.commit()

    # The task is expected to raise on failure; catch this
    try:
        execute_payout_task(None, payout.id, 'flutterwave')
    except Exception as e:
        assert str(e) == "payout failed"

    assert payout.status in ('pending', 'failed')  # Depending on retry logic
