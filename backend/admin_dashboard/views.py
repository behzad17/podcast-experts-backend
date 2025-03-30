from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden
from users.models import CustomUser
from podcasts.models import Podcast, PodcastComment
from experts.models import ExpertProfile
from ratings.models import Rating
from bookmarks.models import Bookmark
from user_messages.models import Message
from django.contrib.auth import get_user_model

User = get_user_model()

@login_required
def admin_stats(request):
    if not request.user.is_staff:
        return HttpResponseForbidden()
    
    data = {
        "users": CustomUser.objects.count(),
        "podcasts": Podcast.objects.count(),
        "experts": ExpertProfile.objects.count(),
        "comments": PodcastComment.objects.count(),
        "ratings": Rating.objects.count(),
        "bookmarks": Bookmark.objects.count(),
        "messages": Message.objects.count(),
    }
    return render(request, 'admin/stats.html', {'data': data})

def admin_stats():
    """Get basic statistics for the admin dashboard."""
    return {
        'total_users': User.objects.count(),
        'total_experts': ExpertProfile.objects.count(),
        'total_podcasts': Podcast.objects.count(),
    }
