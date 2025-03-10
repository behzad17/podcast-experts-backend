from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import UserRegisterSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

# ثبت‌نام کاربر
class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

# ورود کاربر با JWT
class UserLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
