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
        if not obj:
            return None
        
        # Try to get URL from the model property first
        url = obj.profile_picture_url
        
        # If property returned a valid URL (starts with http/https), return it
        if url and isinstance(url, str) and (url.startswith('http://') or url.startswith('https://')):
            return url
        
        # If property returned empty string or None, try alternative methods
        if obj.profile_picture:
            # If it's a file field with a url attribute, use that
            if hasattr(obj.profile_picture, 'url'):
                file_url = obj.profile_picture.url
                if file_url and (file_url.startswith('http://') or file_url.startswith('https://')):
                    return file_url
            
            # If it has a name, try to generate Cloudinary URL
            if hasattr(obj.profile_picture, 'name') and obj.profile_picture.name:
                try:
                    from cloudinary.utils import cloudinary_url
                    clean_name = str(obj.profile_picture.name).lstrip('/')
                    # Remove any leading path separators
                    if clean_name.startswith('expert_profiles/'):
                        clean_name = clean_name
                    cloudinary_url_result, _ = cloudinary_url(clean_name, secure=True, resource_type="image")
                    if cloudinary_url_result and (cloudinary_url_result.startswith('http://') or cloudinary_url_result.startswith('https://')):
                        return cloudinary_url_result
                except Exception:
                    pass
        
        # Return None if no valid URL could be generated
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