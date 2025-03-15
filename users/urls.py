from django.urls import path
from .views import UserRegisterView, UserLoginView, VerifyEmailView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path(
        'verify-email/<str:token>/',
        VerifyEmailView.as_view(),
        name='verify-email'
    ),
]
