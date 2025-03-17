from rest_framework import serializers
from .models import PodcasterProfile, Podcast, Comment


class PodcasterProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PodcasterProfile
        fields = ['id', 'channel_name', 'bio', 'is_approved', 'created_at']


class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_at', 'user_name', 'user_id']
        read_only_fields = ['created_at']


class PodcastSerializer(serializers.ModelSerializer):
    owner = PodcasterProfileSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    views = serializers.IntegerField(read_only=True, default=0)
    average_rating = serializers.FloatField(read_only=True)
    total_bookmarks = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Podcast
        fields = [
            'id',
            'title',
            'description',
            'image',
            'link',
            'created_at',
            'is_approved',
            'owner',
            'views',
            'average_rating',
            'total_bookmarks',
            'comments'
        ]
        read_only_fields = [
            'owner',
            'is_approved',
            'views',
            'average_rating',
            'total_bookmarks'
        ]


class PodcastStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Podcast
        fields = ['id', 'title', 'views', 'average_rating', 'total_bookmarks']
        read_only_fields = fields
