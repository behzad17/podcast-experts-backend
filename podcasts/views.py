from django.shortcuts import render
from rest_framework import generics
from .models import ExpertProfile
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, permissions
from .models import Podcast
from .serializers import PodcastSerializer
from users.models import UserProfile

class PodcastListCreateView(generics.ListCreateAPIView):
    queryset = Podcast.objects.all()
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class PodcastDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Podcast.objects.all()
    serializer_class = PodcastSerializer
    permission_classes = [permissions.IsAuthenticated]
