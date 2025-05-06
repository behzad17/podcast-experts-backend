from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken
from django.utils import timezone
from datetime import datetime

class TokenVerificationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # If we get here, the token is valid because of IsAuthenticated
            return Response({
                'valid': True,
                'user': {
                    'id': request.user.id,
                    'username': request.user.username,
                    'email': request.user.email,
                    'user_type': request.user.user_type
                }
            })
        except Exception as e:
            return Response({
                'valid': False,
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST) 