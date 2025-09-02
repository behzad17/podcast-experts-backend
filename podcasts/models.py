import os
import cloudinary
import cloudinary.uploader
from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET'),
)


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
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def image_url(self):
        """Return podcast image URL or default image if no image exists"""
        if self.image and hasattr(self.image, 'name') and self.image.name:
            # Generate Cloudinary URL directly
            try:
                cloud_name = cloudinary.config().cloud_name
                if cloud_name:
                    # Remove leading slash if present
                    clean_name = self.image.name.lstrip('/')
                    return f"https://res.cloudinary.com/{cloud_name}/image/upload/{clean_name}"
            except Exception:
                pass
        
        # Return a default placeholder image URL
        try:
            cloud_name = cloudinary.config().cloud_name
            if cloud_name:
                return (f"https://res.cloudinary.com/{cloud_name}/"
                        f"image/upload/podcast_images/default_podcast.png")
        except Exception:
            pass
        
        # Fallback to relative path if Cloudinary config fails
        return "podcast_images/default_podcast.png"

    def save(self, *args, **kwargs):
        """Override save to handle any additional logic if needed"""
        # Call the parent save method
        super().save(*args, **kwargs)


class PodcastComment(models.Model):
    podcast = models.ForeignKey(
        Podcast, 
        on_delete=models.CASCADE, 
        related_name='podcast_comments'
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    parent = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='replies'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Comment by {self.user.username} on {self.podcast.title}'


class PodcastLike(models.Model):
    podcast = models.ForeignKey(
        Podcast, 
        on_delete=models.CASCADE, 
        related_name='likes'
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('podcast', 'user')

    def __str__(self):
        return f'{self.user.username} liked {self.podcast.title}'
