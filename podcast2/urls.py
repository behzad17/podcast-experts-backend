from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    Podcast2ListCreateView,
    MyPodcasts2View,
    Category2ViewSet,
    Podcast2ViewSet,
    Podcast2UpdateView,
)

router = DefaultRouter()
router.register(r'categories', Category2ViewSet)
router.register(r'podcasts2', Podcast2ViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('my-podcasts2/', MyPodcasts2View.as_view(), name='my-podcasts2'),
    path('create/', Podcast2ListCreateView.as_view(), name='podcast2-create'),
    path('update/', Podcast2UpdateView.as_view(), name='podcast2-update'),
] 