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
    1. Import the include() function: from my_app import views
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
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
# WhiteNoise handles static file serving automatically
# No need to add static() patterns when using WhiteNoise

# Serve React App for all other routes (SPA routing) - must come last
# Use a more specific pattern that excludes admin, API, static, and media routes
exclude_pattern = (
    r'^(?!admin|api|static|media|favicon\.ico|'
    r'manifest\.json|logo.*\.png).*'
)
urlpatterns.append(
    re_path(
        exclude_pattern,
        serve_react_app,
        kwargs={'path': 'index.html'}
    )
)
