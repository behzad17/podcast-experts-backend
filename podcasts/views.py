from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ExpertProfile, Podcast, PodcasterProfile
from .serializers import PodcastSerializer, PodcasterProfileSerializer
from users.models import UserProfile

class PodcastListCreateView(generics.ListCreateAPIView):
    queryset = Podcast.objects.all()
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class PodcastDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Podcast.objects.all()
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticated]

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user

class PodcasterProfileCreateView(generics.CreateAPIView):
    serializer_class = PodcasterProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, is_approved=False)

class PodcasterProfileUpdateView(generics.UpdateAPIView):
    serializer_class = PodcasterProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    queryset = PodcasterProfile.objects.all()

    def get_queryset(self):
        return PodcasterProfile.objects.filter(user=self.request.user)

class PodcasterProfileDetailView(generics.RetrieveAPIView):
    serializer_class = PodcasterProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return PodcasterProfile.objects.get(user=self.request.user)

class PodcasterProfileApprovalView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            profile = PodcasterProfile.objects.get(pk=pk)
            profile.is_approved = True
            profile.save()
            return Response({'message': 'Profile approved successfully'}, 
                          status=status.HTTP_200_OK)
        except PodcasterProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, 
                          status=status.HTTP_404_NOT_FOUND)
