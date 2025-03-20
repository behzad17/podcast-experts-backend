from django.shortcuts import render, get_object_or_404
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from .models import Podcast2, Podcaster2Profile, Category2
from .serializers import (
    Podcast2Serializer,
    Podcaster2ProfileSerializer,
    Category2Serializer
)
from podcasts.permissions import IsOwnerOrReadOnly
from rest_framework.decorators import action


class IsPodcast2Owner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner.user == request.user


class Podcast2ListCreateView(generics.ListCreateAPIView):
    queryset = Podcast2.objects.all()
    serializer_class = Podcast2Serializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Podcast2.objects.all()
        elif self.request.user.is_authenticated:
            return (
                Podcast2.objects.filter(is_approved=True) |
                Podcast2.objects.filter(owner__user=self.request.user)
            )
        else:
            return Podcast2.objects.filter(is_approved=True)

    def perform_create(self, serializer):
        profile = Podcaster2Profile.get_or_create_profile(self.request.user)
        serializer.save(owner=profile, is_approved=False)


class MyPodcasts2View(generics.ListAPIView):
    serializer_class = Podcast2Serializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Podcast2.objects.filter(owner__user=self.request.user)


class Category2ViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category2.objects.all()
    serializer_class = Category2Serializer
    permission_classes = [permissions.AllowAny]


class Podcast2ViewSet(viewsets.ModelViewSet):
    queryset = Podcast2.objects.all()
    serializer_class = Podcast2Serializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action == 'list':
            return [permissions.AllowAny()]
        elif self.action == 'create':
            return [permissions.IsAuthenticated()]
        elif self.action in ['like', 'dislike']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]

    def get_queryset(self):
        queryset = Podcast2.objects.all()
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
        profile = Podcaster2Profile.get_or_create_profile(self.request.user)
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

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        podcast = self.get_object()
        is_liked = podcast.toggle_like(request.user)
        return Response({
            'is_liked': is_liked,
            'likes_count': podcast.likes_count,
            'dislikes_count': podcast.dislikes_count
        })

    @action(detail=True, methods=['post'])
    def dislike(self, request, pk=None):
        podcast = self.get_object()
        is_disliked = podcast.toggle_dislike(request.user)
        return Response({
            'is_disliked': is_disliked,
            'likes_count': podcast.likes_count,
            'dislikes_count': podcast.dislikes_count
        })


class Podcast2UpdateView(generics.UpdateAPIView):
    serializer_class = Podcast2Serializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Podcast2.objects.filter(owner__user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(owner=self.request.user)
