from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PodcasterProfileCreateView,
    PodcasterProfileUpdateView,
    PodcasterProfileDetailView,
    PodcasterProfileApprovalView,
    MyPodcastsView,
    CategoryViewSet,
    PodcasterProfileViewSet,
    PodcastViewSet,
    PodcastListCreateView,
    PodcastUpdateView,
    PodcastCommentViewSet,
    PodcastReactionViewSet,
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'profiles', PodcasterProfileViewSet)
router.register(r'podcasts', PodcastViewSet)

# Nested router for podcast profiles
podcast_router = DefaultRouter()
podcast_router.register(r'comments', PodcastCommentViewSet, basename='podcast-comment')
podcast_router.register(r'reactions', PodcastReactionViewSet, basename='podcast-reaction')

urlpatterns = [
    path('', include(router.urls)),
    path('podcasts/<int:podcast_pk>/', include(podcast_router.urls)),
    path('my-podcasts/', MyPodcastsView.as_view(), name='my-podcasts'),
    path(
        'profile/create/',
        PodcasterProfileCreateView.as_view(),
        name='podcaster-profile-create'
    ),
    path(
        'profile/update/<int:pk>/',
        PodcasterProfileUpdateView.as_view(),
        name='podcaster-profile-update'
    ),
    path(
        'profile/',
        PodcasterProfileDetailView.as_view(),
        name='podcaster-profile-detail'
    ),
    path(
        'profile/approve/<int:pk>/',
        PodcasterProfileApprovalView.as_view(),
        name='podcaster-profile-approve'
    ),
    path('create/', PodcastListCreateView.as_view(), name='podcast-create'),
    path('update/', PodcastUpdateView.as_view(), name='podcast-update'),
]
