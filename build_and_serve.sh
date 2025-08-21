#!/bin/sh

# Build the React frontend
echo "Building React frontend..."
cd frontend
npm install
npm run build
cd ..

# Collect Django static files
echo "Collecting Django static files..."
python manage.py collectstatic --noinput

# Run Django with Gunicorn
echo "Starting Django server..."
gunicorn backend.wsgi --log-file -
