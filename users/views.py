from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
# EmailMultiAlternatives no longer needed for simple text emails
from django.conf import settings
from .serializers import (
    UserRegisterSerializer,
    UserSerializer,
)
from django.contrib.auth import get_user_model
from .models import UserProfile
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q
from experts.models import ExpertProfile
from podcasts.models import PodcasterProfile

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
        
        # Create a simple, clean verification email
        text_content = f"""
        Welcome to CONNECT!
        
        Hi {user.username},
        
        Please verify your email by clicking this link:
        {verification_url}
        
        If the link doesn't work, copy and paste it into your browser.
        
        This email was sent from CONNECT Platform.
        """
        
        subject = "Verify your email - CONNECT Platform"
        
        try:
            # Send as simple text email - guaranteed to work
            from django.core.mail import send_mail
            result = send_mail(
                subject=subject,
                message=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
            
            print(f"[DEBUG] Verification email sent to {user.email}")
            print(f"[DEBUG] Verification URL: {verification_url}")
            print(f"[DEBUG] Email result: {result}")
            
        except Exception as e:
            print(f"[ERROR] Email failed: {str(e)}")
            raise e


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
            response = super().post(request, *args, **kwargs)
            response.data['user'] = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'user_type': user.user_type
            }
            print(f"[DEBUG] Login successful for user: {username}")
            return response
        except User.DoesNotExist:
            print(f"[DEBUG] User not found: {username}")
            return Response(
                {"detail": "Invalid username or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            print(f"[DEBUG] Unexpected error during login: {str(e)}")
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


class UserMeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserLogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Since we're using JWT, we don't need to do anything server-side
        # The client will handle token removal
        return Response({"message": "Successfully logged out."})


class UserSearchView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def search(self, request):
        search_term = request.query_params.get('search', '')
        user_type = request.query_params.get('user_type', '')
        category_id = request.query_params.get('category', None)

        queryset = User.objects.exclude(id=request.user.id)

        if search_term:
            queryset = queryset.filter(
                Q(username__icontains=search_term) |
                Q(email__icontains=search_term)
            )

        if user_type:
            queryset = queryset.filter(user_type=user_type)

        if user_type == 'expert' and category_id:
            queryset = queryset.filter(expertprofile__categories__id=category_id)

        users = []
        for user in queryset:
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'user_type': user.user_type,
                'profile_picture': None
            }
            
            if user.user_type == 'expert':
                try:
                    expert = ExpertProfile.objects.get(user=user)
                    user_data['expertise'] = expert.expertise
                    user_data['profile_picture'] = expert.profile_picture.url if expert.profile_picture else None
                except ExpertProfile.DoesNotExist:
                    pass
            elif user.user_type == 'podcaster':
                try:
                    podcaster = PodcasterProfile.objects.get(user=user)
                    user_data['profile_picture'] = podcaster.profile_picture.url if podcaster.profile_picture else None
                except PodcasterProfile.DoesNotExist:
                    pass

            users.append(user_data)

        return Response(users)


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
