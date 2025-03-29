from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Rating
from .serializers import RatingSerializer
from django.shortcuts import get_object_or_404
from podcasts.models import Podcast
from experts.models import ExpertProfile

class RatingListCreateView(generics.ListCreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Check if a rating already exists
        if serializer.validated_data.get('podcast'):
            existing_rating = Rating.objects.filter(
                user=self.request.user,
                podcast=serializer.validated_data['podcast']
            ).first()
        else:
            existing_rating = Rating.objects.filter(
                user=self.request.user,
                expert=serializer.validated_data['expert']
            ).first()

        if existing_rating:
            # Update existing rating
            existing_rating.score = serializer.validated_data['score']
            existing_rating.save()
            return existing_rating
        else:
            # Create new rating
            return serializer.save(user=self.request.user)

class RatingDetailView(generics.RetrieveDestroyAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Rating.objects.filter(user=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_rating(request, type, id):
    if type == 'podcast':
        item = get_object_or_404(Podcast, id=id)
        rating = Rating.objects.filter(user=request.user, podcast=item).first()
    elif type == 'expert':
        item = get_object_or_404(ExpertProfile, id=id)
        rating = Rating.objects.filter(user=request.user, expert=item).first()
    else:
        return Response({'detail': 'Invalid type'}, status=status.HTTP_400_BAD_REQUEST)

    if rating:
        return Response({
            'rating_id': rating.id,
            'score': rating.score
        })
    return Response({'rating_id': None, 'score': None})
