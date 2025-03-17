from rest_framework import serializers
from .models import PodcasterProfile, Podcast, Comment


class PodcasterProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PodcasterProfile
        fields = [
            'id',
            'channel_name',
            'description',
            'website',
            'social_media',
            'topics',
            'is_approved'
        ]
        read_only_fields = ['is_approved']


class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_at', 'user', 'user_name']
        read_only_fields = ['user']

    def get_user_name(self, obj):
        if obj.user:
            return obj.user.username
        return None


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
