from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PodcastViewSet, CategoryViewSet, PodcasterProfileViewSet, ReactionView

router = DefaultRouter()
router.register(r'podcasts', PodcastViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'profiles', PodcasterProfileViewSet)
router.register(r'podcasts/(?P<pk>\d+)/reactions', ReactionView, basename='podcast-reactions')

urlpatterns = [
    path('', include(router.urls)),
] 