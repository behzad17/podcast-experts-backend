from django.urls import path
from .views import RatingListCreateView, RatingDetailView, get_rating

urlpatterns = [
    path('', RatingListCreateView.as_view(), name='rating-list'),
    path('<int:pk>/', RatingDetailView.as_view(), name='rating-detail'),
    path('<str:type>/<int:id>/', get_rating, name='get-rating'),
]
