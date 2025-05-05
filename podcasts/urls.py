from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PodcastViewSet,
    PodcasterProfileViewSet,
    CategoryViewSet,
    FeaturedPodcastsView,
)

router = DefaultRouter()
router.register(r'', PodcastViewSet, basename='podcast')
router.register(r'profiles', PodcasterProfileViewSet, basename='podcaster-profile')
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
    path('featured/', FeaturedPodcastsView.as_view(), name='featured-podcasts'),
]
