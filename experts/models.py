from django.db import models
from django.conf import settings

class Expert(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='expert_profile'
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    audio_file = models.FileField(upload_to='expert_audios/')
    cover_image = models.ImageField(upload_to='expert_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Expert Profile - {self.title}"
