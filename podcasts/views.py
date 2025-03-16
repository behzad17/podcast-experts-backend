from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Podcast, PodcasterProfile
from .serializers import PodcastSerializer, PodcasterProfileSerializer


class PodcastListCreateView(generics.ListCreateAPIView):
    queryset = Podcast.objects.all()
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Podcast.objects.all()
        return Podcast.objects.filter(is_approved=True)

    def perform_create(self, serializer):
        podcaster_profile = get_object_or_404(
            PodcasterProfile, user=self.request.user
        )
        if not podcaster_profile.is_approved:
            msg = (
                "Your podcaster profile must be approved "
                "before creating podcasts."
            )
            raise permissions.PermissionDenied(msg)
        serializer.save(owner=podcaster_profile, is_approved=False)


class PodcastDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Podcast.objects.all()
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Podcast.objects.filter(owner__user=self.request.user)


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user


class PodcasterProfileCreateView(generics.CreateAPIView):
    serializer_class = PodcasterProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Check if user already has a profile
        if hasattr(self.request.user, 'podcaster_profile'):
            raise permissions.PermissionDenied(
                "You already have a podcaster profile."
            )
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
        return get_object_or_404(PodcasterProfile, user=self.request.user)


class PodcasterProfileApprovalView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        profile = get_object_or_404(PodcasterProfile, pk=pk)
        profile.is_approved = True
        profile.save()
        return Response(
            {'message': 'Profile approved successfully'},
            status=status.HTTP_200_OK
        )
