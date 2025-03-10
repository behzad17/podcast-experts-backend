from django.shortcuts import render
from rest_framework import generics
from .models import ExpertProfile
from .serializers import ExpertProfileSerializer
from rest_framework.permissions import IsAuthenticated

class ExpertListView(generics.ListAPIView):
    queryset = ExpertProfile.objects.all()
    serializer_class = ExpertProfileSerializer
    permission_classes = [IsAuthenticated]


# Create your views here.
