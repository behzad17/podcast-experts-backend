from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PodcastListView,
    PodcastCreateView,
    PodcastDetailView,
    PodcasterProfileViewSet,
    CategoryViewSet,
    PodcastLikeView,
)

router = DefaultRouter()
# Remove podcast registration since we have explicit views
router.register(
    r'profiles', PodcasterProfileViewSet, basename='podcaster-profile'
)
router.register(
    r'categories', CategoryViewSet, basename='category'
)

urlpatterns = [
    # Explicit podcast views must come before router
    path('', PodcastListView.as_view(), name='podcast-main'),
    path('list/', PodcastListView.as_view(), name='podcast-list'),
    path('create/', PodcastCreateView.as_view(), name='podcast-create'),
    path('<int:pk>/', PodcastDetailView.as_view(), name='podcast-detail'),
    path('featured/', PodcastListView.as_view(), name='podcast-featured'),
    # Add likes endpoints
    path('<int:pk>/likes/', PodcastLikeView.as_view(), name='podcast-likes'),
    # Router comes after explicit views
    path('', include(router.urls)),
]
