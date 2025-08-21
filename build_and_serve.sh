#!/bin/sh

# Note: React frontend should be built locally before deployment
# This script only handles Django static files and serving

# Collect Django static files
echo "Collecting Django static files..."
python manage.py collectstatic --noinput

# Run Django with Gunicorn
echo "Starting Django server..."
gunicorn backend.wsgi --log-file -
