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
)

router = DefaultRouter()
router.register(r'experts', ExpertProfileViewSet, basename='expert')

urlpatterns = [
    path('', ExpertListView.as_view(), name='expert-list'),
    path('create/', ExpertProfileCreateView.as_view(), name='expert-profile-create'),
    path('<int:pk>/', ExpertProfileDetailView.as_view(), name='expert-profile-detail'),
    path('approve/<int:pk>/', ExpertProfileApprovalView.as_view(), name='expert-profile-approve'),
    path('my-profile/', MyExpertProfileView.as_view(), name='expert-my-profile'),
    path('stats/', ExpertStatsView.as_view(), name='expert-stats'),
    path('', include(router.urls)),
] 