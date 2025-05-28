#!/bin/sh

python manage.py collectstatic --noinput
gunicorn backend.wsgi --log-file -
