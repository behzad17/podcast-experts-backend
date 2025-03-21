from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status, permissions
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
from .serializers import UserRegisterSerializer, UserSerializer
from django.contrib.auth import get_user_model
from .models import UserProfile
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework import viewsets

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
        print(f"[DEBUG] Received verification request with token: {token}")
        try:
            user = User.objects.get(verification_token=token)
            debug_msg = (
                f"[DEBUG] Found user: {user.username}, "
                f"Current email_verified status: {user.email_verified}"
            )
            print(debug_msg)
            
            if not user.email_verified:
                print(
                    f"[DEBUG] Verifying email for user: "
                    f"{user.username}"
                )
                user.email_verified = True
                user.verification_token = ""  # Clear the token
                user.save()
                debug_msg = (
                    f"[DEBUG] After save - email_verified: "
                    f"{user.email_verified}, token: {user.verification_token}"
                )
                print(debug_msg)
                return Response(
                    {"message": "Email verified successfully"},
                    status=status.HTTP_200_OK
                )
            print(f"[DEBUG] Email already verified for user: {user.username}")
            return Response(
                {"message": "Email already verified"},
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            print(f"[DEBUG] No user found with token: {token}")
            return Response(
                {"detail": "Invalid verification token"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(f"[DEBUG] Unexpected error during verification: {str(e)}")
            return Response(
                {"detail": "An error occurred during verification"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ورود کاربر با JWT
class UserLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        print(f"[DEBUG] Login attempt for username: {username}")
        try:
            user = User.objects.get(username=username)
            debug_msg = (
                f"[DEBUG] Found user, email_verified status: "
                f"{user.email_verified}"
            )
            print(debug_msg)
            
            if not user.email_verified:
                print(f"[DEBUG] Email not verified for user: {username}")
                return Response(
                    {"detail": "Please verify your email before logging in."},
                    status=status.HTTP_403_FORBIDDEN
                )
            print("[DEBUG] Email verified, proceeding with login")
            
            # Get the token response
            response = super().post(request, *args, **kwargs)
            print(f"[DEBUG] Raw response data: {response.data}")
            
            # Ensure we have the access token
            if 'access' not in response.data:
                print("[DEBUG] No access token in response")
                return Response(
                    {"detail": "Invalid response from authentication service"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Format the response to match what the frontend expects
            formatted_response = {
                'access': response.data['access'],
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name or '',
                    'last_name': user.last_name or ''
                }
            }
            
            print(f"[DEBUG] Formatted response: {formatted_response}")
            return Response(formatted_response)
        except User.DoesNotExist:
            print(f"[DEBUG] User not found: {username}")
            return Response(
                {"detail": "Invalid username or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            print(f"[DEBUG] Unexpected error during login: {str(e)}")
            import traceback
            print(f"[DEBUG] Traceback: {traceback.format_exc()}")
            return Response(
                {"detail": "An error occurred during login"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        user_id = self.kwargs.get('pk')
        if user_id == self.request.user.id:
            return self.request.user
        raise PermissionDenied("You can only view your own user details.")


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
