from django.urls import path
from .views import (
    ExpertProfileCreateView,
    ExpertProfileUpdateView,
    ExpertProfileDetailView,
    ExpertProfileApprovalView,
)

urlpatterns = [
    path('profile/create/', ExpertProfileCreateView.as_view(), name='expert-profile-create'),
    path('profile/update/<int:pk>/', ExpertProfileUpdateView.as_view(), name='expert-profile-update'),
    path('profile/', ExpertProfileDetailView.as_view(), name='expert-profile-detail'),
    path('profile/approve/<int:pk>/', ExpertProfileApprovalView.as_view(), name='expert-profile-approve'),
] 