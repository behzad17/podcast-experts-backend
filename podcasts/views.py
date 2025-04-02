from django.shortcuts import get_object_or_404
from rest_framework import (
    generics, permissions, status, viewsets, filters
)
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.db.models import Sum
from .models import (
    Podcast, PodcasterProfile, Category, PodcastComment, PodcastLike
)
from .serializers import (
    PodcastSerializer,
    PodcasterProfileSerializer,
    CategorySerializer,
    PodcastCommentSerializer,
)
from rest_framework.decorators import action


class IsPodcastOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class PodcastListView(generics.ListAPIView):
    serializer_class = PodcastSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['title', 'created_at', 'views']

    def get_queryset(self):
        queryset = Podcast.objects.all()
        category_id = self.request.query_params.get('category', None)
        if category_id:
            queryset = queryset.filter(category__id=category_id)
        return queryset


class PodcastCreateView(generics.CreateAPIView):
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PodcastDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Podcast.objects.all()

    def get_object(self):
        obj = get_object_or_404(Podcast, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj

    def check_object_permissions(self, request, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if obj.user != request.user:
            raise PermissionDenied(
                "You don't have permission to modify this podcast."
            )


class PodcastViewSet(viewsets.ModelViewSet):
    queryset = Podcast.objects.all()
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['title', 'created_at', 'views']

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'featured']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queryset = Podcast.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__name=category)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        podcast = self.get_object()
        comments = podcast.podcast_comments.all()
        serializer = PodcastCommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        podcast = self.get_object()
        serializer = PodcastCommentSerializer(data={
            'content': request.data.get('content'),
            'parent': request.data.get('parent')
        })
        if serializer.is_valid():
            serializer.save(podcast=podcast, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def reply_comment(self, request, pk=None):
        podcast = self.get_object()
        comment_id = request.data.get('comment_id')
        parent_comment = get_object_or_404(
            PodcastComment, id=comment_id, podcast=podcast
        )
        
        serializer = PodcastCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                podcast=podcast,
                user=request.user,
                parent=parent_comment
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def bookmark(self, request, pk=None):
        podcast = self.get_object()
        if request.user in podcast.bookmarked_by.all():
            podcast.bookmarked_by.remove(request.user)
            return Response({'status': 'unbookmarked'})
        else:
            podcast.bookmarked_by.add(request.user)
            return Response({'status': 'bookmarked'})

    @action(detail=True, methods=['post'])
    def view(self, request, pk=None):
        podcast = self.get_object()
        podcast.views += 1
        podcast.save()
        return Response({'views': podcast.views})

    @action(detail=False, methods=['get'])
    def my_podcasts(self, request):
        podcasts = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(podcasts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        user_podcasts = self.get_queryset().filter(user=request.user)
        total_podcasts = user_podcasts.count()
        total_views = user_podcasts.aggregate(
            total_views=Sum('views')
        )['total_views'] or 0
        total_comments = PodcastComment.objects.filter(
            podcast__user=request.user
        ).count()
        
        return Response({
            'total_podcasts': total_podcasts,
            'total_views': total_views,
            'total_comments': total_comments,
        })

    @action(detail=True, methods=['put', 'patch'])
    def edit_comment(self, request, pk=None):
        podcast = self.get_object()
        comment_id = request.data.get('comment_id')
        comment = get_object_or_404(
            PodcastComment, id=comment_id, podcast=podcast
        )
        
        if comment.user != request.user:
            raise PermissionDenied(
                "You don't have permission to edit this comment."
            )
        
        serializer = PodcastCommentSerializer(
            comment, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def delete_comment(self, request, pk=None):
        podcast = self.get_object()
        comment_id = request.data.get('comment_id')
        comment = get_object_or_404(
            PodcastComment, id=comment_id, podcast=podcast
        )
        
        if comment.user != request.user:
            raise PermissionDenied(
                "You don't have permission to delete this comment."
            )
        
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_podcasts = self.get_queryset().filter(is_featured=True)[:6]
        serializer = self.get_serializer(featured_podcasts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        podcast = self.get_object()
        like, created = PodcastLike.objects.get_or_create(
            podcast=podcast,
            user=request.user
        )
        if not created:
            like.delete()
            return Response({'status': 'unliked'})
        return Response({'status': 'liked'})

    @action(detail=True, methods=['get'])
    def likes_count(self, request, pk=None):
        podcast = self.get_object()
        count = podcast.likes.count()
        return Response({'count': count})


class PodcasterProfileViewSet(viewsets.ModelViewSet):
    queryset = PodcasterProfile.objects.all()
    serializer_class = PodcasterProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__username', 'bio']
    ordering_fields = ['user__username', 'created_at']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return PodcasterProfile.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
