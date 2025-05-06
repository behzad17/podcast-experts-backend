from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Podcast, Category, PodcasterProfile
from .serializers import PodcastSerializer, CategorySerializer, PodcasterProfileSerializer
from django.shortcuts import get_object_or_404

class PodcastViewSet(viewsets.ModelViewSet):
    queryset = Podcast.objects.all()
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Get or create podcaster profile for the user
        podcaster_profile = PodcasterProfile.get_or_create_profile(self.request.user)
        serializer.save(owner=podcaster_profile)

    @action(detail=False, methods=['get'])
    def my_podcasts(self, request):
        """Get all podcasts owned by the current user"""
        podcaster_profile = PodcasterProfile.get_or_create_profile(request.user)
        podcasts = Podcast.objects.filter(owner=podcaster_profile)
        serializer = self.get_serializer(podcasts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def likes(self, request, pk=None):
        podcast = get_object_or_404(Podcast, pk=pk)
        is_liked = podcast.likes.filter(user=request.user).exists()
        return Response({
            'is_liked': is_liked,
            'count': podcast.likes.count()
        })

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        podcast = get_object_or_404(Podcast, pk=pk)
        user = request.user
        
        # Check if user already liked
        existing_like = podcast.likes.filter(user=user).first()
        
        if existing_like:
            # Unlike
            existing_like.delete()
            return Response({'status': 'unliked'})
        else:
            # Like
            podcast.likes.create(user=user)
            return Response({'status': 'liked'})

class ReactionView(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['get'])
    def reactions(self, request, pk=None):
        podcast = get_object_or_404(Podcast, pk=pk)
        reactions = podcast.reactions.all()
        return Response({
            'reactions': [{
                'id': reaction.id,
                'user': reaction.user.id,
                'reaction_type': reaction.reaction_type,
                'created_at': reaction.created_at
            } for reaction in reactions]
        })

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        podcast = get_object_or_404(Podcast, pk=pk)
        user = request.user
        
        # Check if user already liked
        existing_reaction = podcast.reactions.filter(user=user, reaction_type='like').first()
        
        if existing_reaction:
            # Unlike
            existing_reaction.delete()
            return Response({'status': 'unliked'})
        else:
            # Like
            podcast.reactions.create(user=user, reaction_type='like')
            return Response({'status': 'liked'}) 