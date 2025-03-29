from rest_framework import serializers
from .models import Rating
from podcasts.models import Podcast
from experts.models import ExpertProfile

class RatingSerializer(serializers.ModelSerializer):
    podcast_id = serializers.IntegerField(write_only=True, required=False)
    expert_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Rating
        fields = ['id', 'user', 'podcast', 'expert', 'score', 'created_at', 'podcast_id', 'expert_id']
        read_only_fields = ['user', 'created_at']

    def validate(self, data):
        """
        Check that either podcast or expert is provided, but not both.
        """
        if not data.get('podcast_id') and not data.get('expert_id'):
            raise serializers.ValidationError(
                "Either podcast_id or expert_id must be provided"
            )
        if data.get('podcast_id') and data.get('expert_id'):
            raise serializers.ValidationError(
                "Cannot provide both podcast_id and expert_id"
            )
        
        # Validate that the podcast/expert exists
        if data.get('podcast_id'):
            try:
                podcast = Podcast.objects.get(id=data['podcast_id'])
                data['podcast'] = podcast
            except Podcast.DoesNotExist:
                raise serializers.ValidationError("Podcast does not exist")
        
        if data.get('expert_id'):
            try:
                expert = ExpertProfile.objects.get(id=data['expert_id'])
                data['expert'] = expert
            except ExpertProfile.DoesNotExist:
                raise serializers.ValidationError("Expert does not exist")

        return data
