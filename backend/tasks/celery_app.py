from celery import Celery
from config import Config

celery = Celery("emoney", broker=Config.CELERY_BROKER_URL,
                backend=Config.CELERY_RESULT_BACKEND)
celery.conf.update(worker_max_tasks_per_child=100, task_acks_late=True)
# --- IGNORE ---
