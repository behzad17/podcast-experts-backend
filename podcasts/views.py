from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from .models import Podcast, PodcasterProfile
from .serializers import PodcastSerializer, PodcasterProfileSerializer


class IsPodcastOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the podcast owner
        return obj.owner.user == request.user


class PodcastListCreateView(generics.ListCreateAPIView):
    queryset = Podcast.objects.all()
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Podcast.objects.all()
        elif self.request.user.is_authenticated:
            # Show all approved podcasts and user's own podcasts
            return Podcast.objects.filter(
                is_approved=True
            ) | Podcast.objects.filter(
                owner__user=self.request.user
            )
        else:
            # For unauthenticated users, only show approved podcasts
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
            raise PermissionDenied(msg)
        serializer.save(owner=podcaster_profile, is_approved=False)


class PodcastDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticated, IsPodcastOwner]
    queryset = Podcast.objects.all()

    def get_object(self):
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_update(self, serializer):
        # Ensure the owner can't change during update
        serializer.save(owner=self.get_object().owner)


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
            raise PermissionDenied(
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


class MyPodcastsView(generics.ListAPIView):
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Podcast.objects.filter(owner__user=self.request.user)
