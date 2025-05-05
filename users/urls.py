from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    UserRegisterView, UserLoginView, UserLogoutView,
    UserDetailView, UserMeView, VerifyEmailView, UserSearchView,
    UserProfileView
)
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'search', UserSearchView, basename='user-search')

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('logout/', UserLogoutView.as_view(), name='user-logout'),
    path('me/', UserMeView.as_view(), name='user-me'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path(
        'verify-email/<str:token>/',
        VerifyEmailView.as_view(),
        name='verify-email'
    ),
    path('<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]

urlpatterns.extend(router.urls)
