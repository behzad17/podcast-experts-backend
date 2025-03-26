from rest_framework import serializers
from users.models import CustomUser
from .models import ExpertProfile, ExpertRating, ExpertComment, ExpertCategory


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
    user = SimpleUserSerializer(read_only=True)

    class Meta:
        model = ExpertComment
        fields = ['id', 'user', 'content', 'created_at']
        read_only_fields = ['created_at']


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