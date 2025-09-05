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
    ExpertProfileUpdateView,
    ExpertCategoryViewSet,
    ExpertCategoryListView,
    ExpertCommentViewSet,
    ExpertReactionViewSet,
)

router = DefaultRouter()
router.register(r'profiles', ExpertProfileViewSet)
router.register(r'categories', ExpertCategoryViewSet)

# Nested routers for expert profiles
expert_router = DefaultRouter()
expert_router.register(r'comments', ExpertCommentViewSet, basename='expert-comment')
expert_router.register(r'reactions', ExpertReactionViewSet, basename='expert-reaction')

urlpatterns = [
    path('', ExpertListView.as_view(), name='expert-list'),
    path('create/', ExpertProfileCreateView.as_view(),
         name='expert-profile-create'),
    path('pending/', PendingExpertProfilesView.as_view(),
         name='pending-experts'),
    path('update/', ExpertProfileUpdateView.as_view(),
         name='expert-profile-update'),
    path('<int:pk>/', ExpertProfileDetailView.as_view(),
         name='expert-profile-detail'),
    path('approve/<int:pk>/', ExpertProfileApprovalView.as_view(),
         name='expert-profile-approve'),
    path('my-profile/', MyExpertProfileView.as_view(),
         name='expert-my-profile'),
    path('stats/', ExpertStatsView.as_view(), name='expert-stats'),
    path('featured/', ExpertListView.as_view(), name='expert-featured'),
    path('categories/', ExpertCategoryListView.as_view(),
         name='expert-categories'),
    path('', include(router.urls)),
    path('profiles/<int:expert_pk>/', include(expert_router.urls)),
] 