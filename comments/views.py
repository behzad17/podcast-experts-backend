from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import Comment
from .serializers import CommentSerializer


class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        queryset = Comment.objects.filter(parent=None)
        podcast_id = self.request.query_params.get('podcast', None)
        if podcast_id is not None:
            queryset = queryset.filter(podcast_id=podcast_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.user != request.user:
            return Response(
                {"detail": "You cannot edit this comment."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.user != request.user:
            return Response(
                {"detail": "You cannot delete this comment."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        comment = self.get_object()
        is_liked = comment.toggle_like(request.user)
        return Response({
            'is_liked': is_liked,
            'likes_count': comment.likes.count(),
            'dislikes_count': comment.dislikes.count()
        })

    @action(detail=True, methods=['post'])
    def dislike(self, request, pk=None):
        comment = self.get_object()
        is_disliked = comment.toggle_dislike(request.user)
        return Response({
            'is_disliked': is_disliked,
            'likes_count': comment.likes.count(),
            'dislikes_count': comment.dislikes.count()
        })

