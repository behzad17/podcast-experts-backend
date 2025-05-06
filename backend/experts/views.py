from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import ExpertProfile, ExpertCategory, ExpertComment, ExpertReaction
from .serializers import (
    ExpertProfileSerializer,
    ExpertCategorySerializer,
    ExpertCommentSerializer,
    ExpertReactionSerializer
)


class ExpertProfileViewSet(viewsets.ModelViewSet):
    queryset = ExpertProfile.objects.all()
    serializer_class = ExpertProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queryset = ExpertProfile.objects.all()
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_approved=True)
        return queryset

    @action(detail=True, methods=['get'])
    def likes(self, request, pk=None):
        expert = self.get_object()
        likes = ExpertReaction.objects.filter(
            expert=expert,
            reaction_type='like'
        ).count()
        return Response({'likes': likes})

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        expert = self.get_object()
        reaction, created = ExpertReaction.objects.get_or_create(
            expert=expert,
            user=request.user,
            defaults={'reaction_type': 'like'}
        )
        if not created:
            if reaction.reaction_type == 'like':
                reaction.delete()
                return Response({'status': 'unliked'})
            else:
                reaction.reaction_type = 'like'
                reaction.save()
        return Response({'status': 'liked'})

    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        try:
            expert_profile = ExpertProfile.objects.get(user=request.user)
            serializer = self.get_serializer(expert_profile)
            return Response(serializer.data)
        except ExpertProfile.DoesNotExist:
            return Response(
                {'error': 'Expert profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def stats(self, request):
        try:
            expert_profile = ExpertProfile.objects.get(user=request.user)
            stats = {
                'total_views': expert_profile.get_total_views(),
                'total_bookmarks': expert_profile.get_total_bookmarks(),
            }
            return Response(stats)
        except ExpertProfile.DoesNotExist:
            return Response(
                {'error': 'Expert profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def pending(self, request):
        if not request.user.is_staff:
            return Response(
                {'error': 'Only staff members can view pending experts'},
                status=status.HTTP_403_FORBIDDEN
            )
        queryset = ExpertProfile.objects.filter(is_approved=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        if not request.user.is_staff:
            return Response(
                {'error': 'Only staff members can approve experts'},
                status=status.HTTP_403_FORBIDDEN
            )
        expert = self.get_object()
        expert.is_approved = True
        expert.save()
        return Response({'status': 'approved'})


class ExpertCategoryViewSet(viewsets.ModelViewSet):
    queryset = ExpertCategory.objects.all()
    serializer_class = ExpertCategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ExpertCommentViewSet(viewsets.ModelViewSet):
    serializer_class = ExpertCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ExpertComment.objects.filter(
            expert_id=self.kwargs.get('expert_pk')
        )

    def perform_create(self, serializer):
        expert = get_object_or_404(
            ExpertProfile,
            pk=self.kwargs.get('expert_pk')
        )
        serializer.save(
            expert=expert,
            user=self.request.user
        )


class ExpertReactionViewSet(viewsets.ModelViewSet):
    serializer_class = ExpertReactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ExpertReaction.objects.filter(
            expert_id=self.kwargs.get('expert_pk')
        )

    def perform_create(self, serializer):
        expert = get_object_or_404(
            ExpertProfile,
            pk=self.kwargs.get('expert_pk')
        )
        serializer.save(
            expert=expert,
            user=self.request.user
        ) 