from django.urls import path
from .views import PodcastListCreateView, PodcastDetailView

urlpatterns = [
    path('', PodcastListCreateView.as_view(), name='podcast-list'),
    path('<int:pk>/', PodcastDetailView.as_view(), name='podcast-detail'),
]
