from rest_framework import serializers
from .models import ExpertProfile

class ExpertProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpertProfile
        fields = ['id', 'name', 'bio', 'expertise', 'experience_years', 
                 'website', 'social_media', 'is_approved', 'created_at']
        read_only_fields = ['is_approved'] 