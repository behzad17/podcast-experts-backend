from django.urls import path
from .views import UserRegisterView, UserLoginView, VerifyEmailView, UserDetailView
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='user-register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path(
        'verify-email/<str:token>/',
        VerifyEmailView.as_view(),
        name='verify-email'
    ),
    path('<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]
