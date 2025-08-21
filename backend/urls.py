"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app import views
    2. Add a URL to urlpatterns:  path('', views.Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from backend.admin_dashboard.views import admin_stats
from backend.views import serve_react_app


urlpatterns = [
    path('admin/', admin.site.urls),
    path('admin_dashboard/', include('backend.admin_dashboard.urls')),
    path('admin/stats/', admin_stats, name='admin_stats'),
    path('api/users/', include('users.urls')),
    path('api/experts/', include('experts.urls')),
    path('api/podcasts/', include('podcasts.urls')),
    path('api/user_messages/', include('user_messages.urls')),
]

# Add static and media file serving
# Serve React static files from frontend/build
react_static_root = os.path.join(
    settings.BASE_DIR, 'frontend', 'build'
)
urlpatterns += static(
    settings.STATIC_URL, document_root=settings.STATIC_ROOT
)
# Remove media serving since we're using Cloudinary
# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Serve React App for all other routes (SPA routing) - must come last
# Use a more specific pattern that excludes admin, API, static, and media routes
exclude_pattern = (
    r'^(?!admin|api|static|media|favicon\.ico|manifest\.json|logo.*\.png).*'
)
urlpatterns.append(
    re_path(
        exclude_pattern,
        serve_react_app,
        kwargs={'path': 'index.html'}
    )
)
