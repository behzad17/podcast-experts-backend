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
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static
from backend.admin_dashboard.views import admin_stats
from podcasts.models import Podcast
from experts.models import ExpertProfile
from podcasts.serializers import PodcastSerializer
from experts.serializers import ExpertProfileSerializer


def home_view(request):
    featured_podcasts = Podcast.objects.filter(is_featured=True, is_approved=True)
    featured_experts = ExpertProfile.objects.filter(is_featured=True, is_approved=True)
    
    podcast_serializer = PodcastSerializer(featured_podcasts, many=True, context={'request': request})
    expert_serializer = ExpertProfileSerializer(featured_experts, many=True, context={'request': request})
    
    return JsonResponse({
        'featured_podcasts': podcast_serializer.data,
        'featured_experts': expert_serializer.data
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('admin_dashboard/', include('backend.admin_dashboard.urls')),
    path('admin/stats/', admin_stats, name='admin_stats'),
    path('', home_view),
    path('api/users/', include('users.urls')),
    path('api/experts/', include('experts.urls')),
    path('api/podcasts/', include('podcasts.urls')),
    path('api/messages/', include('user_messages.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
