#!/bin/sh

# Skip frontend building on Heroku - use pre-built files
# The frontend should be built locally before deployment
echo "Skipping frontend build on Heroku..."

# Collect Django static files (including React build)
echo "Collecting Django static files..."
python manage.py collectstatic --noinput

# Run Django with Gunicorn on the correct port
echo "Starting Django server on port $PORT..."
gunicorn backend.wsgi --bind 0.0.0.0:$PORT --log-file -
