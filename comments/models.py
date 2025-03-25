from django.db import models
from users.models import UserProfile
from podcasts.models import Podcast

class Comment(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    podcast = models.ForeignKey(Podcast, on_delete=models.CASCADE, blank=True, null=True)
    expert = models.ForeignKey(UserProfile, on_delete=models.CASCADE, blank=True, null=True, related_name="expert_comments")
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user}"
