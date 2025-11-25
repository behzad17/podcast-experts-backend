from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    ExpertProfile, ExpertComment, ExpertCategory, ExpertReaction
)

User = get_user_model()


class ExpertCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpertCategory
        fields = ['id', 'name', 'description']


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class ExpertCommentSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    parent = serializers.PrimaryKeyRelatedField(
        queryset=ExpertComment.objects.all(), 
        required=False, 
        allow_null=True
    )
    expert = serializers.PrimaryKeyRelatedField(
        queryset=ExpertProfile.objects.all(), 
        required=False
    )

    class Meta:
        model = ExpertComment
        fields = [
            'id', 'user', 'content', 'created_at', 'replies', 
            'parent', 'expert'
        ]
        read_only_fields = ['created_at']

    def get_replies(self, obj):
        replies = ExpertComment.objects.filter(parent=obj)
        return ExpertCommentSerializer(replies, many=True).data


class ExpertReactionSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(read_only=True)

    class Meta:
        model = ExpertReaction
        fields = ['id', 'user', 'reaction_type', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class ExpertProfileSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(read_only=True)
    categories = ExpertCategorySerializer(many=True, read_only=True)
    category_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        help_text="List of category IDs to associate with this expert profile"
    )
    total_views = serializers.SerializerMethodField()
    total_bookmarks = serializers.SerializerMethodField()
    comments = ExpertCommentSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    dislikes_count = serializers.SerializerMethodField()
    
    # Keep profile_picture as a regular ImageField for file uploads
    # Add a separate field for the Cloudinary URL
    profile_picture_display_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ExpertProfile
        fields = [
            'id', 'user', 'name', 'bio', 'expertise', 'categories',
            'category_ids', 'experience_years', 'website', 'social_media',
            'email', 'profile_picture', 'profile_picture_display_url', 'is_approved',
            'is_featured', 'created_at', 'total_views', 'total_bookmarks',
            'comments', 'likes_count', 'dislikes_count'
        ]
        read_only_fields = ['is_approved']

    def get_total_views(self, obj):
        return obj.get_total_views()

    def get_total_bookmarks(self, obj):
        return obj.get_total_bookmarks()

    def get_profile_picture_display_url(self, obj):
        """Return Cloudinary URL for profile picture"""
        if not obj or not obj.profile_picture:
            return None
        
        # Use the file field's url property which already contains the correct Cloudinary URL
        if hasattr(obj.profile_picture, 'url'):
            return obj.profile_picture.url
        
        return None

    def get_likes_count(self, obj):
        return obj.get_likes_count()

    def get_dislikes_count(self, obj):
        return obj.get_dislikes_count()

    def create(self, validated_data):
        category_ids = validated_data.pop('category_ids', [])
        expert_profile = super().create(validated_data)

        if category_ids:
            expert_profile.categories.set(category_ids)

        return expert_profile

    def update(self, instance, validated_data):
        category_ids = validated_data.pop('category_ids', None)
        expert_profile = super().update(instance, validated_data)

        if category_ids is not None:
            expert_profile.categories.set(category_ids)

        return expert_profile