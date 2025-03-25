from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from .models import Podcast, PodcasterProfile, Category
from .serializers import (
    PodcastSerializer,
    PodcasterProfileSerializer,
    CategorySerializer
)
from .permissions import IsOwnerOrReadOnly
from rest_framework.decorators import action


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
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_staff:
            return PodcasterProfile.objects.all()
        return PodcasterProfile.objects.filter(user=self.request.user)


class PodcastViewSet(viewsets.ModelViewSet):
    queryset = Podcast.objects.all()
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action == 'list':
            return [permissions.AllowAny()]
        elif self.action == 'create':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]

    def get_queryset(self):
        queryset = Podcast.objects.all()
        category = self.request.query_params.get('category', None)
        
        if category:
            queryset = queryset.filter(category_id=category)
            
        if self.request.user.is_staff:
            return queryset
        elif self.request.user.is_authenticated:
            return (
                queryset.filter(is_approved=True) |
                queryset.filter(owner__user=self.request.user)
            )
        return queryset.filter(is_approved=True)

    def perform_create(self, serializer):
        profile = PodcasterProfile.get_or_create_profile(self.request.user)
        serializer.save(owner=profile)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        if not request.user.is_staff:
            return Response(
                {'detail': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        podcast = self.get_object()
        podcast.is_approved = True
        podcast.save()
        return Response({'status': 'podcast approved'})


class PodcastUpdateView(generics.UpdateAPIView):
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Podcast.objects.filter(creator=self.request.user)

    def perform_update(self, serializer):
        serializer.save(creator=self.request.user)
