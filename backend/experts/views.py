from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import ExpertProfile
from .serializers import ExpertProfileSerializer


class ExpertListView(generics.ListCreateAPIView):
    queryset = ExpertProfile.objects.filter(is_approved=True)
    serializer_class = ExpertProfileSerializer


class ExpertDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ExpertProfile.objects.filter(is_approved=True)
    serializer_class = ExpertProfileSerializer


class FeaturedExpertsView(generics.ListAPIView):
    queryset = ExpertProfile.objects.filter(is_featured=True, is_approved=True)
    serializer_class = ExpertProfileSerializer


class ExpertLikeView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ExpertProfile.objects.all()
    serializer_class = ExpertProfileSerializer

    def post(self, request, pk):
        expert = get_object_or_404(ExpertProfile, pk=pk)
        user = request.user

        if user in expert.likes.all():
            expert.likes.remove(user)
            is_liked = False
        else:
            expert.likes.add(user)
            is_liked = True

        return Response({
            'is_liked': is_liked,
            'likes_count': expert.likes.count()
        }, status=status.HTTP_200_OK) 