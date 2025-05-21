web: gunicorn backend.wsgi --log-file -
release: cd frontend && npm install && npm run build && cd .. && python manage.py collectstatic --noinput
