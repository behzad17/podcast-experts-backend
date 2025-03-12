from django.http import JsonResponse
from django.contrib.auth import get_user_model
from podcasts.models import Podcast
from collaborations.models import CollaborationRequest

User = get_user_model()

def admin_stats(request):
    data = {
        "users": User.objects.count(),
        "podcasts": Podcast.objects.count(),
        "collaborations": CollaborationRequest.objects.count(),
    }
    return JsonResponse(data)
