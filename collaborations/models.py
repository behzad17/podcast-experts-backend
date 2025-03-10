from django.db import models
from users.models import UserProfile
from podcasts.models import Podcast

class CollaborationRequest(models.Model):
    sender = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='sent_requests')
    receiver = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='received_requests')
    podcast = models.ForeignKey(Podcast, on_delete=models.CASCADE)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request from {self.sender} to {self.receiver}"
