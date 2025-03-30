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
from django.urls import path, include
from django.http import HttpResponse
from backend.admin_dashboard.views import admin_stats


def home_view(request):
    return HttpResponse("<h1>Welcome to Podcast Experts API</h1>")


urlpatterns = [
    path('admin/', admin.site.urls),
    path('admin_dashboard/', include('backend.admin_dashboard.urls')),
    path('admin/stats/', admin_stats, name='admin_stats'),
    path('', home_view),
    path('api/users/', include('users.urls')),
    path('api/experts/', include('experts.urls')),
    path('api/podcasts/', include('podcasts.urls')),
    path('api/messages/', include('user_messages.urls')),
]
