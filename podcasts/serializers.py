from rest_framework import serializers
from .models import Podcast, PodcastComment, Category, PodcasterProfile
from users.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class PodcasterProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PodcasterProfile
        fields = ['id', 'bio', 'website', 'social_links', 'created_at']

class PodcastCommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    parent = serializers.PrimaryKeyRelatedField(queryset=PodcastComment.objects.all(), required=False, allow_null=True)
    
    class Meta:
        model = PodcastComment
        fields = ['id', 'user', 'content', 'created_at', 'replies', 'parent']
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
    category = CategorySerializer(read_only=True)
    owner = UserSerializer(read_only=True)
    image_url = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Podcast
        fields = [
            'id', 'title', 'description', 'image', 'image_url', 'link',
            'category', 'owner', 'is_featured', 'is_approved',
            'created_at', 'updated_at', 'likes_count', 'is_liked', 'views'
        ]
        read_only_fields = ['owner', 'created_at', 'updated_at', 'views']

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)

class PodcastStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Podcast
        fields = ['id', 'title', 'total_bookmarks']
        read_only_fields = fields
