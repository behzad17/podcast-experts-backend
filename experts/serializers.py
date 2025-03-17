from rest_framework import serializers
from .models import ExpertProfile
from users.serializers import UserSerializer


class ExpertProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ExpertProfile
        fields = [
            'id', 'user', 'name', 'bio', 'expertise', 'experience_years',
            'website', 'social_media', 'is_approved', 'created_at'
        ]
        read_only_fields = ['is_approved'] 