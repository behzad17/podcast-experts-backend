from rest_framework import serializers
from .models import Expert
from users.serializers import UserSerializer

class ExpertSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Expert
        fields = [
            'id', 'user', 'username', 'title', 'description',
            'audio_file', 'cover_image', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at'] 