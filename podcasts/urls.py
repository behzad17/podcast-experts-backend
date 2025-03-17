from django.urls import path
from .views import (
    PodcastListCreateView,
    PodcastDetailView,
    PodcasterProfileCreateView,
    PodcasterProfileUpdateView,
    PodcasterProfileDetailView,
    PodcasterProfileApprovalView,
    MyPodcastsView,
    CommentListCreateView,
    CommentDetailView,
)

urlpatterns = [
    path('', PodcastListCreateView.as_view(), name='podcast-list-create'),
    path('my-podcasts/', MyPodcastsView.as_view(), name='my-podcasts'),
    path('<int:pk>/', PodcastDetailView.as_view(), name='podcast-detail'),
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
    path('<int:podcast_id>/comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('<int:podcast_id>/comments/<int:pk>/', CommentDetailView.as_view(), name='comment-detail'),
]
