from rest_framework import serializers
from .models import Category, PodcasterProfile, Podcast, PodcastComment
from django.contrib.auth import get_user_model

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class PodcasterProfileSerializer(serializers.ModelSerializer):
    podcasts = serializers.SerializerMethodField()

    class Meta:
        model = PodcasterProfile
        fields = '__all__'

    def get_podcasts(self, obj):
        request = self.context.get('request')
        if request and request.user == obj.user:
            return PodcastSerializer(obj.podcasts.all(), many=True).data
        return []


class PodcastCommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    parent = serializers.PrimaryKeyRelatedField(
        queryset=PodcastComment.objects.all(), 
        required=False, 
        allow_null=True
    )
    
    class Meta:
        model = PodcastComment
        fields = [
            'id', 'user', 'content', 'created_at', 'replies', 'parent'
        ]
        read_only_fields = ['created_at']

    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'profile_picture': getattr(obj.user, 'profile_picture', None)
        }

    def get_replies(self, obj):
        if obj.parent is not None:  # Don't get replies for replies
            return []
        replies = PodcastComment.objects.filter(parent=obj)
        serializer = PodcastCommentSerializer(replies, many=True)
        return serializer.data


class PodcastSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(
        write_only=True, 
        required=False
    )
    comments = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    views = serializers.IntegerField(read_only=True, default=0)
    image_url = serializers.SerializerMethodField()
    
    # Keep image as a regular ImageField for file uploads
    # Add a separate field for the Cloudinary URL
    image_display_url = serializers.SerializerMethodField()

    class Meta:
        model = Podcast
        fields = [
            'id', 'title', 'description', 'owner', 'category', 
            'category_id', 'image', 'image_display_url', 'image_url', 'link', 'is_approved', 
            'created_at', 'comments', 'likes_count', 'views'
        ]
        read_only_fields = ['created_at']

    def get_owner(self, obj):
        return {
            'id': obj.owner.id,
            'username': obj.owner.user.username,
            'user': obj.owner.user.id
        }

    def get_image_display_url(self, obj):
        """Return Cloudinary URL for podcast image"""
        return obj.image_url

    def get_image_url(self, obj):
        """Return Cloudinary URL for podcast image or default image"""
        return obj.image_url

    def get_comments(self, obj):
        comments = obj.podcast_comments.filter(parent=None)
        return PodcastCommentSerializer(comments, many=True).data

    def get_likes_count(self, obj):
        return obj.likes.count()


class PodcastStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Podcast
        fields = ['id', 'title', 'views', 'total_bookmarks']
        read_only_fields = fields
