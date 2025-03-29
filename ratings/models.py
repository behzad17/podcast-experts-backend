from django.db import models
from django.contrib.auth import get_user_model
from podcasts.models import Podcast
from experts.models import ExpertProfile

User = get_user_model()

class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    podcast = models.ForeignKey(Podcast, on_delete=models.CASCADE, blank=True, null=True)
    expert = models.ForeignKey(ExpertProfile, on_delete=models.CASCADE, blank=True, null=True, related_name="expert_ratings")
    score = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # امتیاز بین 1 تا 5
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [('user', 'podcast'), ('user', 'expert')]

    def __str__(self):
        return f"Rating by {self.user.username}: {self.score}"
