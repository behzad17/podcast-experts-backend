"""
Custom views for serving static files and handling SPA routing
"""
import os
import json
from django.http import JsonResponse, HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.mail import send_mail
from django.conf import settings
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


@csrf_exempt
@require_http_methods(["POST"])
def contact_submit(request):
    """
    Handle contact form submissions and send email to admin
    """
    try:
        # Parse JSON data from request
        data = json.loads(request.body)
        
        # Extract form data
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()
        category = data.get('category', 'general').strip()
        
        # Validate required fields
        if not all([name, email, subject, message]):
            return JsonResponse({
                'success': False,
                'error': 'All required fields must be filled out.'
            }, status=400)
        
        # Validate email format
        if '@' not in email or '.' not in email:
            return JsonResponse({
                'success': False,
                'error': 'Please enter a valid email address.'
            }, status=400)
        
        # Prepare email content
        email_subject = f"Contact Form: {subject} - {category}"
        
        email_body = f"""
New Contact Form Submission

Name: {name}
Email: {email}
Subject: {subject}
Category: {category}

Message:
{message}

---
This message was sent from the CONNECT platform contact form.
        """.strip()
        
        # Get admin email from settings or use a default
        admin_email = getattr(
            settings, 'ADMIN_EMAIL', settings.EMAIL_HOST_USER
        )
        
        # Send email to admin
        send_mail(
            subject=email_subject,
            message=email_body,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[admin_email],
            fail_silently=False,
        )
        
        return JsonResponse({
            'success': True,
            'message': ('Your message has been sent successfully! '
                       'We\'ll get back to you soon.')
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid data format.'
        }, status=400)
        
    except Exception as e:
        # Log the error (in production, you'd want proper logging)
        print(f"Contact form error: {str(e)}")
        
        return JsonResponse({
            'success': False,
            'error': ('An error occurred while sending your message. '
                     'Please try again later.')
        }, status=500)
