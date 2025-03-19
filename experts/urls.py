from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExpertListView,
    ExpertProfileCreateView,
    ExpertProfileDetailView,
    ExpertProfileApprovalView,
    MyExpertProfileView,
    ExpertStatsView,
    ExpertProfileViewSet,
    PendingExpertProfilesView,
)

router = DefaultRouter()
router.register(r'experts', ExpertProfileViewSet, basename='expert')

urlpatterns = [
    path('pending/', PendingExpertProfilesView.as_view(), name='pending-experts'),
    path('create/', ExpertProfileCreateView.as_view(), name='expert-profile-create'),
    path('my-profile/', MyExpertProfileView.as_view(), name='expert-my-profile'),
    path('stats/', ExpertStatsView.as_view(), name='expert-stats'),
    path('approve/<int:pk>/', ExpertProfileApprovalView.as_view(), name='expert-profile-approve'),
    path('<int:pk>/', ExpertProfileDetailView.as_view(), name='expert-profile-detail'),
    path('', ExpertListView.as_view(), name='expert-list'),
    path('', include(router.urls)),
] 