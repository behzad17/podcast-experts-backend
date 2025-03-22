from django.db import models
from django.conf import settings

class Expert(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='expert_profile'
    )
    name = models.CharField(max_length=200, default='')
    expertise = models.CharField(max_length=200, default='')
    experience_years = models.IntegerField(default=0)
    bio = models.TextField(default='')
    website = models.URLField(blank=True, null=True)
    social_media = models.CharField(max_length=200, blank=True, null=True)
    profile_image = models.ImageField(
        upload_to='expert_images/',
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.expertise}"
