from rest_framework import generics, permissions
from .models import Bookmark
from .serializers import BookmarkSerializer


class BookmarkListCreateView(generics.ListCreateAPIView):
    queryset = Bookmark.objects.all()
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
