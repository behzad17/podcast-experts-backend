from rest_framework import serializers
from .models import Category2, Podcaster2Profile, Podcast2, Comment2
from users.serializers import UserSerializer


class Category2Serializer(serializers.ModelSerializer):
    class Meta:
        model = Category2
        fields = ['id', 'name', 'slug', 'description']


class Comment2Serializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment2
        fields = ['id', 'user', 'content', 'created_at']
        read_only_fields = ['user']


class Podcaster2ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Podcaster2Profile
        fields = [
            'id', 'user', 'bio', 'website', 'social_links',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class Podcast2Serializer(serializers.ModelSerializer):
    owner = Podcaster2ProfileSerializer(read_only=True)
    category = Category2Serializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False)
    comments = Comment2Serializer(many=True, read_only=True)
    views = serializers.IntegerField(read_only=True, default=0)
    average_rating = serializers.FloatField(read_only=True)
    total_bookmarks = serializers.IntegerField(read_only=True, default=0)
    likes_count = serializers.SerializerMethodField()
    dislikes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_disliked = serializers.SerializerMethodField()

    class Meta:
        model = Podcast2
        fields = [
            'id',
            'title',
            'description',
            'image',
            'link',
            'created_at',
            'updated_at',
            'is_approved',
            'owner',
            'category',
            'category_id',
            'views',
            'average_rating',
            'total_bookmarks',
            'comments',
            'likes_count',
            'dislikes_count',
            'is_liked',
            'is_disliked'
        ]
        read_only_fields = [
            'created_at',
            'updated_at',
            'is_approved',
            'views',
            'average_rating',
            'total_bookmarks'
        ]

    def get_likes_count(self, obj):
        return obj.likes_count

    def get_dislikes_count(self, obj):
        return obj.dislikes_count

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.is_liked_by(request.user)
        return False

    def get_is_disliked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.is_disliked_by(request.user)
        return False 