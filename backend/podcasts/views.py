from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Podcast, Category, PodcasterProfile
from .serializers import PodcastSerializer, CategorySerializer, PodcasterProfileSerializer
from django.shortcuts import get_object_or_404

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