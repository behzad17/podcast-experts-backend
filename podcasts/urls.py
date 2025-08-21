from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PodcastListView,
    PodcastCreateView,
    PodcastDetailView,
    PodcasterProfileViewSet,
    CategoryViewSet,
    PodcastLikeView,
    PodcastCommentViewSet,
    PodcastApprovalView,
    PodcastViewSet,
)

router = DefaultRouter()
# Register podcast viewsets
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
    # Explicit podcast views must come before router
    path('', PodcastListView.as_view(), name='podcast-main'),
    path('list/', PodcastListView.as_view(), name='podcast-list'),
    path('create/', PodcastCreateView.as_view(), name='podcast-create'),
    path('<int:pk>/', PodcastDetailView.as_view(), name='podcast-detail'),
    path('featured/', PodcastListView.as_view(), name='podcast-featured'),
    # Add likes endpoints
    path('<int:pk>/likes/', PodcastLikeView.as_view(), name='podcast-likes'),
    path('<int:pk>/like/', PodcastLikeView.as_view(), name='podcast-like'),
    # Add comment endpoints
    path('<int:podcast_pk>/comments/', PodcastCommentViewSet.as_view({'get': 'list', 'post': 'create'}), name='podcast-comments'),
    path('<int:podcast_pk>/comments/<int:pk>/', PodcastCommentViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='podcast-comment-detail'),
    # Add approval endpoint for admins
    path('<int:pk>/approve/', PodcastApprovalView.as_view(), name='podcast-approve'),
    # Router comes after explicit views
    path('', include(router.urls)),
]
