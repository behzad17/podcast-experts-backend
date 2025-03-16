from django.urls import path
from .views import (
    ExpertListView,
    ExpertProfileCreateView,
    ExpertProfileDetailView,
    ExpertProfileApprovalView,
)

urlpatterns = [
    path('', ExpertListView.as_view(), name='expert-list'),
    path('profile/create/', ExpertProfileCreateView.as_view(), name='expert-profile-create'),
    path('profile/<int:pk>/', ExpertProfileDetailView.as_view(), name='expert-profile-detail'),
    path('profile/approve/<int:pk>/', ExpertProfileApprovalView.as_view(), name='expert-profile-approve'),
] 