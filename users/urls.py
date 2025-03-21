from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserRegisterView, VerifyEmailView, UserDetailView,
    UserViewSet, UserLoginView
)
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', UserLoginView.as_view(), name='token_obtain_pair'),
    path('register/', UserRegisterView.as_view(), name='user_register'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path(
        'verify-email/<str:token>/',
        VerifyEmailView.as_view(),
        name='verify-email'
    ),
    path('<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]
