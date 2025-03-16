from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404
from .serializers import UserRegisterSerializer
from django.contrib.auth import get_user_model
from .models import UserProfile

User = get_user_model()


# ثبت‌نام کاربر
class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        # Create UserProfile for the new user
        UserProfile.objects.create(user=user)
        token = user.generate_verification_token()
        self.send_verification_email(user, token)

    def send_verification_email(self, user, token):
        verification_url = f"{settings.FRONTEND_URL}/verify-email/{token}"
        subject = "Verify your email address"
        message = f"""
        Hi {user.username},
        Please verify your email address by clicking the link below:
        {verification_url}

        If you did not create this account, please ignore this email.
        """
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        try:
            print(f"Verifying email with token: {token}")
            user = get_object_or_404(User, verification_token=token)
            print(f"Found user: {user.username}")
            
            if not user.email_verified:
                user.email_verified = True
                user.verification_token = ""
                user.save()
                print(f"Email verified for user: {user.username}")
                return Response(
                    {"message": "Email verified successfully"},
                    status=status.HTTP_200_OK
                )
            else:
                print(f"Email already verified for user: {user.username}")
                return Response(
                    {"message": "Email already verified"},
                    status=status.HTTP_200_OK
                )
        except Exception as e:
            print(f"Error verifying email: {str(e)}")
            return Response(
                {"detail": "Invalid or expired verification token"},
                status=status.HTTP_400_BAD_REQUEST
            )


# ورود کاربر با JWT
class UserLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        try:
            user = User.objects.get(username=username)
            if not user.email_verified:
                return Response(
                    {"detail": "Please verify your email before logging in."},
                    status=status.HTTP_403_FORBIDDEN
                )
            response = super().post(request, *args, **kwargs)
            # Add user data to the response
            response.data['user'] = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'user_type': user.user_type
            }
            return response
        except User.DoesNotExist:
            return Response(
                {"detail": "Invalid username or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )
