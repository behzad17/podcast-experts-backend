from django.urls import path
from .views import (
    ExpertListView,
    ExpertProfileCreateView,
    ExpertProfileDetailView,
    ExpertProfileApprovalView,
    MyExpertProfileView,
    ExpertStatsView,
)

urlpatterns = [
    path('', ExpertListView.as_view(), name='expert-list'),
    path('create/', ExpertProfileCreateView.as_view(), name='expert-profile-create'),
    path('<int:pk>/', ExpertProfileDetailView.as_view(), name='expert-profile-detail'),
    path('approve/<int:pk>/', ExpertProfileApprovalView.as_view(), name='expert-profile-approve'),
    path('my-profile/', MyExpertProfileView.as_view(), name='expert-my-profile'),
    path('stats/', ExpertStatsView.as_view(), name='expert-stats'),
] 