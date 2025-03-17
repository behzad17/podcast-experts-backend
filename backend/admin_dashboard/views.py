from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden
from users.models import CustomUser
from podcasts.models import Podcast
from experts.models import ExpertProfile
from comments.models import Comment
from ratings.models import Rating
from bookmarks.models import Bookmark
from user_messages.models import Message

@login_required
def admin_stats(request):
    if not request.user.is_staff:
        return HttpResponseForbidden()
    
    data = {
        "users": CustomUser.objects.count(),
        "podcasts": Podcast.objects.count(),
        "experts": ExpertProfile.objects.count(),
        "comments": Comment.objects.count(),
        "ratings": Rating.objects.count(),
        "bookmarks": Bookmark.objects.count(),
        "messages": Message.objects.count(),
    }
    return render(request, 'admin/stats.html', {'data': data})
