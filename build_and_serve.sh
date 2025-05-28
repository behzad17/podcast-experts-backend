#!/bin/sh

# Build frontend
cd frontend
npm install
npm run build
cd ..

# Collect static files
python manage.py collectstatic --noinput

# Run the server
gunicorn backend.wsgi --log-file -

