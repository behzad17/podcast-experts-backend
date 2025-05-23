from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PodcastViewSet, ReactionView

router = DefaultRouter()
router.register(r'podcasts', PodcastViewSet, basename='podcast')
router.register(r'reactions', ReactionView, basename='reaction')

urlpatterns = [
    path('', include(router.urls)),
] 