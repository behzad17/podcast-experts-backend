#!/bin/sh

# Build React frontend for production
echo "Building React frontend..."
cd frontend
npm install
npm run build
cd ..

# Collect Django static files (including React build)
echo "Collecting Django static files..."
python manage.py collectstatic --noinput

# Run Django with Gunicorn
echo "Starting Django server..."
gunicorn backend.wsgi --log-file -
