from rest_framework import serializers
from .models import Category, PodcasterProfile, Podcast, Comment


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']


class PodcasterProfileSerializer(serializers.ModelSerializer):
    podcasts = serializers.SerializerMethodField()

    class Meta:
        model = PodcasterProfile
        fields = [
            'id', 'user', 'bio', 'website', 'social_links',
            'created_at', 'updated_at', 'podcasts'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_podcasts(self, obj):
        request = self.context.get('request')
        if request and request.user == obj.user:
            return PodcastSerializer(obj.podcasts.all(), many=True).data
        return []


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
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False)
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
            'updated_at',
            'is_approved',
            'owner',
            'category',
            'category_id',
            'views',
            'average_rating',
            'total_bookmarks',
            'comments'
        ]
        read_only_fields = [
            'created_at',
            'updated_at',
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
