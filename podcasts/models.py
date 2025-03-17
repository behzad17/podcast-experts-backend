from django.db import models
from django.utils import timezone
from users.models import CustomUser

# Create your models here.
class PodcasterProfile(models.Model):
    user = models.OneToOneField(
        CustomUser, 
        on_delete=models.CASCADE, 
        related_name='podcaster_profile'
    )
    channel_name = models.CharField(max_length=255)
    description = models.TextField()
    website = models.URLField(blank=True, null=True)
    social_media = models.TextField(blank=True, null=True)
    topics = models.CharField(max_length=255)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} - {self.channel_name}"

class Podcast(models.Model):
    owner = models.ForeignKey(
        PodcasterProfile, 
        on_delete=models.CASCADE, 
        related_name='podcasts'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='podcasts/', blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    podcast = models.ForeignKey(Podcast, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Comment by {self.user.username} on {self.podcast.title}'[:79]
