from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PodcastListView,
    PodcastCreateView,
    PodcastDetailView,
    PodcastViewSet,
    PodcasterProfileViewSet,
    CategoryViewSet,
)

router = DefaultRouter()
router.register(
    r'podcasts', PodcastViewSet, basename='podcast'
)
router.register(
    r'profiles', PodcasterProfileViewSet, basename='podcaster-profile'
)
router.register(
    r'categories', CategoryViewSet, basename='category'
)

urlpatterns = [
    path('', include(router.urls)),
    path('list/', PodcastListView.as_view(), name='podcast-list'),
    path('create/', PodcastCreateView.as_view(), name='podcast-create'),
    path('<int:pk>/', PodcastDetailView.as_view(), name='podcast-detail'),
]
