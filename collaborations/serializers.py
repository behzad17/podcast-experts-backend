from rest_framework import serializers
from .models import CollaborationRequest

class CollaborationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollaborationRequest
        fields = '__all__'
