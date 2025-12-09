from django.db import models
from users.models import UserProfile
from podcasts.models import Podcast


class Bookmark(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    expert = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, blank=True, null=True,
        related_name="bookmarked_experts"
    )
    podcast = models.ForeignKey(Podcast, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} bookmarked {self.expert or self.podcast}"
