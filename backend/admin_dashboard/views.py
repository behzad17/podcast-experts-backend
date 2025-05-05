from django.http import JsonResponse
from django.contrib.auth.decorators import user_passes_test
from podcasts.models import Podcast
from experts.models import ExpertProfile
from users.models import CustomUser

@user_passes_test(lambda u: u.is_superuser)
def admin_stats(request):
    """
    Get basic statistics for the admin dashboard
    """
    total_podcasts = Podcast.objects.count()
    approved_podcasts = Podcast.objects.filter(is_approved=True).count()
    total_experts = ExpertProfile.objects.count()
    approved_experts = ExpertProfile.objects.filter(is_approved=True).count()
    total_users = CustomUser.objects.count()
    
    return JsonResponse({
        'total_podcasts': total_podcasts,
        'approved_podcasts': approved_podcasts,
        'total_experts': total_experts,
        'approved_experts': approved_experts,
        'total_users': total_users,
    })
