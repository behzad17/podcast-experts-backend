from django.db import models
from users.models import CustomUser
from django.conf import settings
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from experts.models import ExpertProfile

User = get_user_model()

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class PodcasterProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='podcaster_profile'
    )
    bio = models.TextField(blank=True)
    website = models.URLField(blank=True, null=True, default='')
    social_links = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Podcaster Profile"

    @classmethod
    def get_or_create_profile(cls, user):
        profile, created = cls.objects.get_or_create(
            user=user,
            defaults={
                'bio': '',
                'website': '',
                'social_links': {}
            }
        )
        return profile

class Podcast(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    owner = models.ForeignKey(
        PodcasterProfile,
        on_delete=models.CASCADE,
        related_name='podcasts'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='podcasts'
    )
    image = models.ImageField(
        upload_to='podcast_images/',
        null=True,
        blank=True
    )
    link = models.URLField(null=True, blank=True, default='')
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class Comment(models.Model):
    podcast = models.ForeignKey(
        Podcast,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Comment by {self.user.username} on {self.podcast.title}'[:79]

class PodcastComment(models.Model):
    podcast = models.ForeignKey(Podcast, on_delete=models.CASCADE, related_name='podcast_comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Comment by {self.user.username} on {self.podcast.title}'

class PodcastReaction(models.Model):
    podcast = models.ForeignKey(Podcast, on_delete=models.CASCADE, related_name='reactions')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reaction_type = models.CharField(max_length=10, choices=[('like', 'Like'), ('dislike', 'Dislike')])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('podcast', 'user')

    def __str__(self):
        return f"{self.user.username} {self.reaction_type}d {self.podcast.title}"
