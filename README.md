# E-Money Secure Backend

## Requirements
Docker, Docker Compose

## Setup
1. Copy `.env` into `backend/.env` and set secrets (DATABASE_URL, JWT_SECRET_KEY, FLUTTERWAVE_SECRET, etc.)
2. Build & run:
   docker compose up --build -d

3. Run migrations (Flask-Migrate / Alembic)
   docker compose exec backend flask db init
   docker compose exec backend flask db migrate
   docker compose exec backend flask db upgrade

4. Start celery:
   docker compose up -d celery

5. Health:
   GET http://localhost:5000/health
