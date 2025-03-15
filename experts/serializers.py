from rest_framework import serializers
from .models import ExpertProfile

class ExpertProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpertProfile
        fields = ['id', 'specialty', 'bio', 'participation_method', 
                 'sample_works', 'contact_methods', 'is_approved']
        read_only_fields = ['is_approved'] 