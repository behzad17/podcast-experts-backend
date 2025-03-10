from django.db import models
from users.models import UserProfile

# Create your models here.
class Podcast(models.Model):
    host = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name='podcasts')
    title = models.CharField(max_length=255)
    description = models.TextField()
    podcast_link = models.URLField()

    def __str__(self):
        return self.title
class ExpertProfile(models.Model):
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name="expert_profile")
    specialty = models.CharField(max_length=255)
    website = models.URLField(blank=True, null=True)
    availability = models.CharField(max_length=50, choices=[('online', 'Online'), ('in-person', 'In-Person')])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username
