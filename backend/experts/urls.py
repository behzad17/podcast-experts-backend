from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExpertProfileViewSet,
    ExpertCategoryViewSet,
    ExpertCommentViewSet,
    ExpertReactionViewSet,
)

router = DefaultRouter()
router.register(r'profiles', ExpertProfileViewSet, basename='expert-profile')
router.register(r'categories', ExpertCategoryViewSet)

# Nested routers for expert profiles
expert_router = DefaultRouter()
expert_router.register(r'comments', ExpertCommentViewSet, basename='expert-comment')
expert_router.register(r'reactions', ExpertReactionViewSet, basename='expert-reaction')

urlpatterns = [
    path('', include(router.urls)),
    path('profiles/<int:expert_pk>/', include(expert_router.urls)),
] 