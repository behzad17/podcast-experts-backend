from rest_framework import serializers
from .models import Category, Podcast, PodcasterProfile


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class PodcasterProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = PodcasterProfile
        fields = [
            'id', 'username', 'email', 'bio', 'website', 'social_links',
            'profile_picture', 'profile_picture_url', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PodcastSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.user.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    likes_count = serializers.IntegerField(read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Podcast
        fields = [
            'id', 'title', 'description', 'link', 'image', 'image_url',
            'category', 'category_name', 'owner', 'owner_name', 'is_featured',
            'is_approved', 'created_at', 'updated_at', 'likes_count', 'is_liked'
        ]
        read_only_fields = [
            'id', 'is_featured', 'is_approved', 'created_at', 'updated_at',
            'likes_count', 'is_liked'
        ]

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user in obj.likes.all()
        return False
