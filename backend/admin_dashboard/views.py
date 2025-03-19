from django.shortcuts import render
from django.contrib.auth.decorators import permission_required
from django.http import HttpResponseForbidden
from django.db.models import Count
from users.models import CustomUser
from podcasts.models import Podcast
from experts.models import ExpertProfile
from comments.models import Comment
from ratings.models import Rating
from bookmarks.models import Bookmark
from user_messages.models import Message

@permission_required('is_staff')
def admin_stats(request):
    """View for admin dashboard statistics"""
    try:
        # Use select_related and prefetch_related for better performance
        data = {
            "users": CustomUser.objects.count(),
            "podcasts": Podcast.objects.select_related('user').count(),
            "experts": ExpertProfile.objects.select_related('user').count(),
            "comments": Comment.objects.select_related('user', 'podcast').count(),
            "ratings": Rating.objects.select_related('user', 'podcast').count(),
            "bookmarks": Bookmark.objects.select_related('user', 'podcast').count(),
            "messages": Message.objects.select_related('sender', 'receiver').count(),
        }
        return render(request, 'admin/stats.html', {'data': data})
    except Exception as e:
        print(f"Error in admin_stats: {str(e)}")
        return HttpResponseForbidden("Error loading admin statistics")
