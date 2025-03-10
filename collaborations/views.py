from rest_framework import generics, permissions
from .models import CollaborationRequest
from .serializers import CollaborationRequestSerializer

class CollaborationListCreateView(generics.ListCreateAPIView):  
    queryset = CollaborationRequest.objects.all()
    serializer_class = CollaborationRequestSerializer

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

class CollaborationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CollaborationRequest.objects.all()
    serializer_class = CollaborationRequestSerializer
