from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from podcasts.models import Podcast, PodcasterProfile, PodcastComment
from experts.models import ExpertProfile
from users.models import CustomUser


@login_required
def admin_stats(request):
    if not request.user.is_staff:
        return render(
            request, 
            'admin_dashboard/error.html', 
            {'error': 'Access denied'}
        )
    
    stats = {
        'total_users': CustomUser.objects.count(),
        'total_podcasts': Podcast.objects.count(),
        'total_experts': ExpertProfile.objects.count(),
        'total_podcasters': PodcasterProfile.objects.count(),
        'total_comments': PodcastComment.objects.count(),
        'pending_podcasts': Podcast.objects.filter(is_approved=False).count(),
        'pending_experts': ExpertProfile.objects.filter(is_approved=False).count(),
        'recent_podcasts': Podcast.objects.order_by('-created_at')[:5],
        'recent_experts': ExpertProfile.objects.order_by('-created_at')[:5],
        'recent_users': CustomUser.objects.order_by('-date_joined')[:5],
    }
    
    return render(request, 'admin_dashboard/stats.html', stats)
