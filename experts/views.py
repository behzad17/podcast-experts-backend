from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ExpertProfile
from .serializers import ExpertProfileSerializer

# Create your views here.

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user

class ExpertProfileCreateView(generics.CreateAPIView):
    serializer_class = ExpertProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, is_approved=False)

class ExpertProfileUpdateView(generics.UpdateAPIView):
    serializer_class = ExpertProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    queryset = ExpertProfile.objects.all()

    def get_queryset(self):
        return ExpertProfile.objects.filter(user=self.request.user)

class ExpertProfileDetailView(generics.RetrieveAPIView):
    serializer_class = ExpertProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return ExpertProfile.objects.get(user=self.request.user)

class ExpertProfileApprovalView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            profile = ExpertProfile.objects.get(pk=pk)
            profile.is_approved = True
            profile.save()
            return Response({'message': 'Profile approved successfully'}, status=status.HTTP_200_OK)
        except ExpertProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
