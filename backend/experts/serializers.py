from rest_framework import serializers
from users.serializers import UserSerializer
from .models import (
    ExpertProfile,
    ExpertCategory,
    ExpertComment,
    ExpertReaction
)


class ExpertCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpertCategory
        fields = ['id', 'name', 'description']


class ExpertCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = ExpertComment
        fields = [
            'id',
            'user',
            'content',
            'parent',
            'replies',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_replies(self, obj):
        if obj.parent is None:  # Only get replies for parent comments
            replies = ExpertComment.objects.filter(parent=obj)
            return ExpertCommentSerializer(replies, many=True).data
        return []


class ExpertReactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ExpertReaction
        fields = ['id', 'user', 'reaction_type', 'created_at']
        read_only_fields = ['user', 'created_at']


class ExpertProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    categories = ExpertCategorySerializer(many=True, read_only=True)
    comments = ExpertCommentSerializer(many=True, read_only=True)
    total_views = serializers.SerializerMethodField()
    total_bookmarks = serializers.SerializerMethodField()
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = ExpertProfile
        fields = [
            'id',
            'user',
            'name',
            'bio',
            'expertise',
            'categories',
            'experience_years',
            'website',
            'social_media',
            'profile_picture',
            'profile_picture_url',
            'is_approved',
            'is_featured',
            'created_at',
            'total_views',
            'total_bookmarks',
            'comments'
        ]
        read_only_fields = ['is_approved', 'is_featured']

    def get_total_views(self, obj):
        return obj.get_total_views()

    def get_total_bookmarks(self, obj):
        return obj.get_total_bookmarks()

    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
        return None 