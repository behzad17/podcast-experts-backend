"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import HttpResponse
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.views.static import serve
from backend.admin_dashboard.views import admin_stats


def home_view(request):
    return HttpResponse("<h1>Welcome to Podcast Experts API</h1>")


urlpatterns = [
    path('admin/', admin.site.urls),
    path('admin_dashboard/', include('backend.admin_dashboard.urls')),
    path('admin/stats/', admin_stats, name='admin_stats'),
    # API endpoints
    path('api/auth/', include('users.urls')),
    path('api/users/', include('users.urls')),
    path('api/experts/', include('experts.urls')),
    path('api/podcasts/', include('podcasts.urls')),
    path('api/messages/', include('user_messages.urls')),
    path('api/bookmarks/', include('bookmarks.urls')),
    # Serve static files
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
    # Serve React App for all other routes
    re_path(r'^(?!api/).*', TemplateView.as_view(template_name='index.html')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
