from rest_framework import generics, status, serializers
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Podcast, PodcasterProfile
from .serializers import PodcastSerializer, PodcasterProfileSerializer

class PodcastListView(APIView):
    def get(self, request):
        podcasts = Podcast.objects.filter(is_approved=True)
        serializer = PodcastSerializer(podcasts, many=True)
        return Response(serializer.data)

class PodcastDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Podcast.objects.filter(is_approved=True)
    serializer_class = PodcastSerializer

class FeaturedPodcastsView(generics.ListAPIView):
    queryset = Podcast.objects.filter(is_featured=True, is_approved=True)
    serializer_class = PodcastSerializer

class PodcastLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        print(f"Like request received for podcast {pk}")
        print(f"User: {request.user}")
        print(f"User authenticated: {request.user.is_authenticated}")
        
        podcast = get_object_or_404(Podcast, pk=pk)
        user = request.user

        if user in podcast.likes.all():
            podcast.likes.remove(user)
            is_liked = False
        else:
            podcast.likes.add(user)
            is_liked = True

        return Response({
            'is_liked': is_liked,
            'likes_count': podcast.likes.count()
        }, status=status.HTTP_200_OK)

class PodcasterProfileListView(generics.ListAPIView):
    serializer_class = PodcasterProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PodcasterProfile.objects.filter(user=self.request.user)

class PodcasterProfileCreateView(generics.CreateAPIView):
    serializer_class = PodcasterProfileSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Check if user already has a profile
        if hasattr(self.request.user, 'podcaster_profile'):
            raise serializers.ValidationError(
                "You already have a podcaster profile"
            )
        serializer.save(user=self.request.user)

class MyPodcastsView(generics.ListAPIView):
    serializer_class = PodcastSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            podcaster_profile = self.request.user.podcaster_profile
            return Podcast.objects.filter(owner=podcaster_profile)
        except PodcasterProfile.DoesNotExist:
            return Podcast.objects.none() 