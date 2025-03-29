from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status, viewsets, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from .models import Podcast, PodcasterProfile, Category, PodcastComment
from .serializers import (
    PodcastSerializer,
    PodcasterProfileSerializer,
    CategorySerializer,
    PodcastCommentSerializer,
)
from .permissions import IsOwnerOrReadOnly
from rest_framework.decorators import action
from django.db.models import Q
from ratings.models import Rating


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
            return (
                Podcast.objects.filter(is_approved=True) |
                Podcast.objects.filter(owner__user=self.request.user)
            )
        else:
            # For unauthenticated users, only show approved podcasts
            return Podcast.objects.filter(is_approved=True)

    def perform_create(self, serializer):
        profile = PodcasterProfile.get_or_create_profile(self.request.user)
        serializer.save(owner=profile, is_approved=False)


class PodcastDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Podcast.objects.all()

    def get_object(self):
        obj = super().get_object()
        if (
            not obj.is_approved and 
            not self.request.user.is_staff and 
            obj.owner.user != self.request.user
        ):
            raise PermissionDenied("This podcast is not approved yet.")
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_update(self, serializer):
        # Ensure the owner can't change during update
        serializer.save(owner=self.get_object().owner)


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


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class PodcasterProfileViewSet(viewsets.ModelViewSet):
    queryset = PodcasterProfile.objects.all()
    serializer_class = PodcasterProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return PodcasterProfile.objects.all()
        return PodcasterProfile.objects.filter(user=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class PodcastViewSet(viewsets.ModelViewSet):
    queryset = Podcast.objects.all()
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']

    def get_queryset(self):
        if self.request.user.is_staff:
            return Podcast.objects.all()
        elif self.request.user.is_authenticated:
            return (
                Podcast.objects.filter(is_approved=True) |
                Podcast.objects.filter(owner__user=self.request.user)
            )
        else:
            return Podcast.objects.filter(is_approved=True)

    def perform_create(self, serializer):
        profile = PodcasterProfile.get_or_create_profile(self.request.user)
        serializer.save(owner=profile, is_approved=False)

    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        podcast = self.get_object()
        return Response({
            'total_views': podcast.total_views,
            'total_likes': podcast.total_likes,
            'total_comments': podcast.total_comments,
            'average_rating': podcast.get_average_rating(),
        })

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        if not request.user.is_staff:
            return Response(
                {"detail": "Only staff members can approve podcasts."},
                status=status.HTTP_403_FORBIDDEN
            )
        podcast = self.get_object()
        podcast.is_approved = True
        podcast.save()
        return Response({"status": "podcast approved"})

    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        podcast = self.get_object()
        comments = podcast.podcast_comments.filter(parent=None)
        serializer = PodcastCommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_comment(self, request, pk=None):
        podcast = self.get_object()
        serializer = PodcastCommentSerializer(data={
            'podcast': podcast.id,
            'content': request.data.get('content'),
            'parent': request.data.get('parent')
        })
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def reply_comment(self, request, pk=None):
        podcast = self.get_object()
        parent_comment = get_object_or_404(
            PodcastComment,
            id=request.data.get('parent'),
            podcast=podcast
        )
        serializer = PodcastCommentSerializer(data={
            'podcast': podcast.id,
            'content': request.data.get('content'),
            'parent': parent_comment.id
        })
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def ratings(self, request, pk=None):
        podcast = self.get_object()
        ratings = Rating.objects.filter(podcast=podcast)
        return Response({
            'average_rating': podcast.get_average_rating(),
            'total_ratings': podcast.get_total_ratings(),
            'user_rating': ratings.filter(user=request.user).first().score if ratings.filter(user=request.user).exists() else None
        })


class PodcastUpdateView(generics.UpdateAPIView):
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Podcast.objects.filter(creator=self.request.user)

    def perform_update(self, serializer):
        serializer.save(creator=self.request.user)


class PodcastCommentViewSet(viewsets.ModelViewSet):
    serializer_class = PodcastCommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        podcast_id = self.kwargs.get('podcast_pk')
        return PodcastComment.objects.filter(podcast_id=podcast_id)

    def perform_create(self, serializer):
        podcast_id = self.kwargs.get('podcast_pk')
        podcast = get_object_or_404(Podcast, id=podcast_id)
        serializer.save(podcast=podcast, user=self.request.user)
