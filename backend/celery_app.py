# celery_app.py
from celery import Celery
from config import Config
import os

# Configure Celery
celery = Celery(
    'e_money',  # Replace with your project name
    broker=os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379/0'),
    backend=os.environ.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
)

celery.config_from_object(Config)

# Optional: If you want to use the Flask app context in Celery tasks
class ContextTask(celery.Task):
    def __call__(self, *args, **kwargs):
        from app import app  # Import your Flask app
        with app.app_context():
            return self.run(*args, **kwargs)

celery.Task = ContextTask
