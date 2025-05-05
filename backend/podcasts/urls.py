from django.urls import path
from . import views

urlpatterns = [
    # Podcast endpoints
    path('', views.PodcastListView.as_view(), name='podcast-list'),
    path('<int:pk>/', views.PodcastDetailView.as_view(), name='podcast-detail'),
    path('featured/', views.FeaturedPodcastsView.as_view(), name='featured-podcasts'),
    path('<int:pk>/like/', views.PodcastLikeView.as_view(), name='podcast-like'),
    
    # Podcaster profile endpoints
    path('profiles/', views.PodcasterProfileListView.as_view(), name='podcaster-profile-list'),
    path('profile/create/', views.PodcasterProfileCreateView.as_view(), name='podcaster-profile-create'),
    path('my-podcasts/', views.MyPodcastsView.as_view(), name='my-podcasts'),
]
