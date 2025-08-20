"""
Custom views for serving static files and handling SPA routing
"""
import os
from django.conf import settings
from django.http import HttpResponse, Http404
from django.views.static import serve


def serve_static_file(request, file_path):
    """Serve static files directly from the staticfiles directory"""
    static_root = settings.STATIC_ROOT
    full_path = os.path.join(static_root, file_path)
    
    if not os.path.exists(full_path):
        raise Http404(f"File not found: {file_path}")
    
    # Determine content type based on file extension
    content_type = 'text/plain'
    if file_path.endswith('.js'):
        content_type = 'application/javascript'
    elif file_path.endswith('.css'):
        content_type = 'text/css'
    elif file_path.endswith('.png'):
        content_type = 'image/png'
    elif file_path.endswith('.jpg') or file_path.endswith('.jpeg'):
        content_type = 'image/jpeg'
    elif file_path.endswith('.ico'):
        content_type = 'image/x-icon'
    elif file_path.endswith('.json'):
        content_type = 'application/json'
    
    with open(full_path, 'rb') as f:
        content = f.read()
    
    response = HttpResponse(content, content_type=content_type)
    return response


def serve_react_static(request, file_path):
    """Serve React static files directly from the build directory"""
    build_path = os.path.join(settings.BASE_DIR, 'frontend', 'build')
    full_path = os.path.join(build_path, 'static', file_path)
    
    if not os.path.exists(full_path):
        raise Http404(f"File not found: {file_path}")
    
    # Determine content type based on file extension
    content_type = 'text/plain'
    if file_path.endswith('.js'):
        content_type = 'application/javascript'
    elif file_path.endswith('.css'):
        content_type = 'text/css'
    elif file_path.endswith('.png'):
        content_type = 'image/png'
    elif file_path.endswith('.jpg') or file_path.endswith('.jpeg'):
        content_type = 'image/jpeg'
    elif file_path.endswith('.ico'):
        content_type = 'image/x-icon'
    elif file_path.endswith('.json'):
        content_type = 'application/json'
    
    with open(full_path, 'rb') as f:
        content = f.read()
    
    response = HttpResponse(content, content_type=content_type)
    return response


def serve_react_app(request, path):
    """Serve React app for all routes that don't match API routes"""
    build_path = os.path.join(settings.BASE_DIR, 'frontend', 'build')
    return serve(request, 'index.html', document_root=build_path)
