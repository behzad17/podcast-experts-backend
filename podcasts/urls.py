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
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'profiles', PodcasterProfileViewSet)
router.register(r'podcasts', PodcastViewSet)

urlpatterns = [
    path('', include(router.urls)),
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
]
