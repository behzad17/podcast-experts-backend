from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Expert
from .serializers import ExpertSerializer
from podcasts.permissions import IsOwnerOrReadOnly

# Create your views here.

class ExpertViewSet(viewsets.ModelViewSet):
    queryset = Expert.objects.all()
    serializer_class = ExpertSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        queryset = Expert.objects.all()
        if self.request.user.is_staff:
            return queryset
        elif self.request.user.is_authenticated:
            return queryset
        return queryset
