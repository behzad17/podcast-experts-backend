from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination
from .models import Podcast, PodcasterProfile, Comment
from .serializers import PodcastSerializer, PodcasterProfileSerializer, CommentSerializer


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
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Podcast.objects.all()
        # Show all approved podcasts and user's own podcasts
        return Podcast.objects.filter(
            is_approved=True
        ) | Podcast.objects.filter(
            owner__user=self.request.user
        )

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


class CommentPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = CommentPagination

    def get_queryset(self):
        podcast_id = self.kwargs.get('podcast_id')
        return Comment.objects.filter(podcast_id=podcast_id)

    def perform_create(self, serializer):
        podcast_id = self.kwargs.get('podcast_id')
        podcast = get_object_or_404(Podcast, id=podcast_id)
        serializer.save(podcast=podcast, user=self.request.user)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        response.data = {
            'comments': response.data['results'],
            'total': response.data['count'],
            'next': response.data['next'],
            'previous': response.data['previous']
        }
        return response


class CommentDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        podcast_id = self.kwargs.get('podcast_id')
        return Comment.objects.filter(podcast_id=podcast_id)

    def destroy(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.user != request.user:
            raise PermissionDenied("You can only delete your own comments.")
        return super().destroy(request, *args, **kwargs)
