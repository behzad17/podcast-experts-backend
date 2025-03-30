from rest_framework import serializers
from users.models import CustomUser
from .models import ExpertProfile, ExpertRating, ExpertComment, ExpertCategory, ExpertReaction
from django.contrib.auth import get_user_model

User = get_user_model()


class ExpertCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpertCategory
        fields = ['id', 'name', 'description']


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email']
        read_only_fields = ['id', 'username', 'email']


class ExpertCommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = ExpertComment
        fields = ['id', 'expert', 'user', 'content', 'parent', 'replies', 'created_at', 'updated_at']
        read_only_fields = ['user', 'replies']

    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username
        }

    def get_replies(self, obj):
        if obj.parent is not None:  # Don't get replies for replies
            return []
        replies = ExpertComment.objects.filter(parent=obj)
        serializer = ExpertCommentSerializer(replies, many=True)
        return serializer.data


class ExpertRatingSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(read_only=True)

    class Meta:
        model = ExpertRating
        fields = ['id', 'user', 'rating', 'created_at']


class ExpertProfileSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(read_only=True)
    categories = ExpertCategorySerializer(many=True, read_only=True)
    total_views = serializers.SerializerMethodField()
    total_bookmarks = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    comments = ExpertCommentSerializer(many=True, read_only=True)
    ratings = ExpertRatingSerializer(many=True, read_only=True)
    profile_picture_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ExpertProfile
        fields = [
            'id', 'user', 'name', 'bio', 'expertise', 'categories',
            'experience_years', 'website', 'social_media', 'profile_picture',
            'profile_picture_url', 'is_approved', 'created_at',
            'total_views', 'total_bookmarks', 'average_rating',
            'comments', 'ratings'
        ]
        read_only_fields = ['is_approved']

    def get_total_views(self, obj):
        return obj.get_total_views()

    def get_total_bookmarks(self, obj):
        return obj.get_total_bookmarks()

    def get_average_rating(self, obj):
        return obj.get_average_rating()

    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            return self.context['request'].build_absolute_uri(
                obj.profile_picture.url
            )
        return None 


class ExpertReactionSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    expert = serializers.ReadOnlyField(source='expert.id')

    class Meta:
        model = ExpertReaction
        fields = ['id', 'expert', 'user', 'reaction_type', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at'] 