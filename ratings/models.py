from django.db import models
from users.models import UserProfile
from podcasts.models import Podcast

class Rating(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    podcast = models.ForeignKey(Podcast, on_delete=models.CASCADE, blank=True, null=True)
    expert = models.ForeignKey(UserProfile, on_delete=models.CASCADE, blank=True, null=True, related_name="expert_ratings")
    score = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # امتیاز بین 1 تا 5
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rating by {self.user}: {self.score}"
