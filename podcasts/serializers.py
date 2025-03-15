from rest_framework import serializers
from .models import PodcasterProfile, Podcast

class PodcasterProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PodcasterProfile
        fields = ['id', 'channel_name', 'description', 'website', 
                 'social_media', 'topics', 'is_approved']
        read_only_fields = ['is_approved']

class PodcastSerializer(serializers.ModelSerializer):
    class Meta:
        model = Podcast
        fields = ['id', 'title', 'description', 'image', 'link', 'created_at']
        read_only_fields = ['owner']
