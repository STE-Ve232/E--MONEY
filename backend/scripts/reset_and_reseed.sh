```bash
#!/usr/bin/env bash
# This script waits for Postgres, then runs migrations and seed inside the backend container.
# Intended to be used as an entrypoint in Docker or run via `docker compose exec backend sh -c ./docker/init-db.sh`
set -euo pipefail


: ${DATABASE_URL:?Need to set DATABASE_URL}


function wait_for_postgres() {
echo "⏳ Waiting for Postgres..."
until pg_isready -q -d "$DATABASE_URL"; do
echo "Postgres is unavailable - sleeping 1s"
sleep 1
done
echo "✅ Postgres is up"
}


wait_for_postgres


# Run migrations and seed
echo "🔁 Applying migrations (deploy)..."
npx prisma migrate deploy


echo "🧱 Generating Prisma client..."
npx prisma generate


echo "🌱 Seeding database..."
npm run seed


echo "🟢 DB initialization complete"
```