from django.db import models
from django.utils import timezone
from users.models import UserProfile

# Create your models here.
class Podcast(models.Model):
    owner = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='podcasts')
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='podcasts/', blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
class ExpertProfile(models.Model):
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name="expert_profile")
    specialty = models.CharField(max_length=255)
    website = models.URLField(blank=True, null=True)
    availability = models.CharField(max_length=50, choices=[('online', 'Online'), ('in-person', 'In-Person')])
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.user.username
