from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import EmailMultiAlternatives
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
        
        # Create HTML email content
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email - CONNECT Platform</title>
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }}
                .email-container {{
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }}
                .header {{
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 28px;
                    font-weight: 600;
                }}
                .header p {{
                    margin: 10px 0 0 0;
                    opacity: 0.9;
                    font-size: 16px;
                }}
                .content {{
                    padding: 40px 30px;
                    text-align: center;
                }}
                .welcome-text {{
                    font-size: 18px;
                    color: #333;
                    margin-bottom: 25px;
                }}
                .verification-button {{
                    display: inline-block;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-decoration: none;
                    padding: 15px 30px;
                    border-radius: 25px;
                    font-size: 16px;
                    font-weight: 600;
                    margin: 20px 0;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                    transition: all 0.3s ease;
                }}
                .verification-button:hover {{
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                }}
                .verification-link {{
                    color: #667eea;
                    text-decoration: none;
                    word-break: break-all;
                }}
                .verification-link:hover {{
                    text-decoration: underline;
                }}
                .info-text {{
                    color: #666;
                    font-size: 14px;
                    margin-top: 25px;
                    line-height: 1.5;
                }}
                .footer {{
                    background-color: #f8f9fa;
                    padding: 20px 30px;
                    text-align: center;
                    border-top: 1px solid #e9ecef;
                }}
                .footer p {{
                    margin: 0;
                    color: #666;
                    font-size: 12px;
                }}
                .logo {{
                    font-size: 24px;
                    font-weight: bold;
                    color: #ffd700;
                    margin-bottom: 10px;
                }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <div class="logo">🎙️ CONNECT</div>
                    <h1>Welcome to CONNECT!</h1>
                    <p>Your Professional Podcast & Expert Network</p>
                </div>
                
                <div class="content">
                    <p class="welcome-text">Hi <strong>{user.username}</strong>,</p>
                    
                    <p>Thank you for joining CONNECT! To complete your registration 
                    and start building your professional network, please verify your 
                    email address.</p>
                    
                    <a href="{verification_url}" class="verification-button">
                        ✅ Verify Email Address
                    </a>
                    
                    <p class="info-text">
                        If the button above doesn't work, you can copy and paste this 
                        link into your browser:<br>
                        <a href="{verification_url}" class="verification-link">
                            {verification_url}
                        </a>
                    </p>
                    
                    <p class="info-text">
                        <strong>What happens next?</strong><br>
                        After verification, you'll be able to log in and start creating 
                        your profile, connecting with other professionals, and building 
                        your network on CONNECT.
                    </p>
                </div>
                
                <div class="footer">
                    <p>This email was sent from CONNECT Platform. If you didn't create 
                    an account, please ignore this email.</p>
                    <p>&copy; 2024 CONNECT Platform. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Create plain text version for email clients that don't support HTML
        text_content = f"""
        Welcome to CONNECT!
        
        Hi {user.username},
        
        Thank you for joining CONNECT! To complete your registration and start building 
        your professional network, please verify your email address.
        
        Click this link to verify your email:
        {verification_url}
        
        What happens next?
        After verification, you'll be able to log in and start creating your profile, 
        connecting with other professionals, and building your network on CONNECT.
        
        This email was sent from CONNECT Platform. If you didn't create an account, 
        please ignore this email.
        
        © 2024 CONNECT Platform. All rights reserved.
        """
        
        # Send HTML email with both HTML and plain text versions
        subject = "Verify your email address - Welcome to CONNECT!"
        
        # Create EmailMultiAlternatives object for HTML email
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,  # Plain text version
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email]
        )
        
        # Attach HTML version
        email.attach_alternative(html_content, "text/html")
        
        # Send the email
        email.send(fail_silently=False)


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
