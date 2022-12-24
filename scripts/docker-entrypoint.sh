#!/bin/bash

# until psql "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${POSTGRES_NAME}" -c '\l'; do
#   echo >&2 "postgres is unavailable - sleeping"
#   sleep 1
# done

# if [ "${YOUR_ENV}" == "production" ]; then
#   ./scripts/docker-entrypoint.prod.sh
# else
#   ./scripts/docker-entrypoint.dev.sh
# fi

echo "Collect static files"
python manage.py collectstatic --noinput

echo "Apply database migrations"
python manage.py migrate

echo "Starting prod server"
python manage.py runserver 0.0.0.0:8080