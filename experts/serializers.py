from rest_framework import serializers
from .models import ExpertProfile, ExpertRating, ExpertComment
from users.serializers import UserSerializer


class ExpertCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ExpertComment
        fields = ['id', 'user', 'content', 'created_at', 'updated_at']


class ExpertRatingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ExpertRating
        fields = ['id', 'user', 'rating', 'created_at']


class ExpertProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    total_views = serializers.SerializerMethodField()
    total_bookmarks = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    comments = ExpertCommentSerializer(many=True, read_only=True)
    ratings = ExpertRatingSerializer(many=True, read_only=True)
    
    class Meta:
        model = ExpertProfile
        fields = [
            'id', 'user', 'name', 'bio', 'expertise', 'experience_years',
            'website', 'social_media', 'is_approved', 'created_at',
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