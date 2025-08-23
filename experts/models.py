import os
import cloudinary
import cloudinary.uploader
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET'),
)


# Create your models here.
class ExpertCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Expert Categories"


class ExpertProfile(models.Model):
    user = models.OneToOneField(
        'users.CustomUser',
        on_delete=models.CASCADE,
        related_name='expert_profile'
    )
    name = models.CharField(max_length=255)
    bio = models.TextField()
    expertise = models.CharField(max_length=255)
    categories = models.ManyToManyField(ExpertCategory, related_name='experts')
    experience_years = models.IntegerField()
    website = models.URLField(blank=True, null=True)
    social_media = models.TextField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True, help_text="Contact email for this expert")
    profile_picture = models.ImageField(
        upload_to='expert_profiles/', 
        blank=True, 
        null=True
    )
    is_approved = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    views = models.ManyToManyField(
        'users.CustomUser', 
        related_name='viewed_experts', 
        blank=True
    )
    bookmarks = models.ManyToManyField(
        'users.CustomUser', 
        related_name='bookmarked_experts', 
        blank=True
    )

    def get_likes_count(self):
        return self.reactions.filter(reaction_type='like').count()

    def get_dislikes_count(self):
        return self.reactions.filter(reaction_type='dislike').count()

    def __str__(self):
        return f"{self.name} - {self.expertise}"

    def get_total_views(self):
        return self.views.count()

    def get_total_bookmarks(self):
        return self.bookmarks.count()
    
    @property
    def profile_picture_url(self):
        """Return Cloudinary URL or default image if no profile picture exists"""
        if self.profile_picture and hasattr(self.profile_picture, 'url'):
            # Check if it's already a Cloudinary URL
            if self.profile_picture.name.startswith('http'):
                return self.profile_picture.name
            # If it's a local path, construct Cloudinary URL
            elif self.profile_picture.name.startswith('expert_profiles/'):
                cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
                if cloud_name:
                    return f"https://res.cloudinary.com/{cloud_name}/image/upload/v1/{self.profile_picture.name}"
        
        # Return a default placeholder image
        return "expert_profiles/default_profile.png"

    def save(self, *args, **kwargs):
        """Override save to handle Cloudinary upload"""
        # Call the parent save method first
        super().save(*args, **kwargs)
        
        # If there's a profile picture, upload it to Cloudinary
        if self.profile_picture and hasattr(self.profile_picture, 'path'):
            try:
                # Create a unique identifier using username and ID
                unique_id = f"{self.user.username}_{self.id}".replace(' ', '_').lower()
                
                # Upload to Cloudinary
                result = cloudinary.uploader.upload(
                    self.profile_picture.path,
                    public_id=f"expert_profiles/{unique_id}",
                    resource_type="auto",
                    overwrite=True
                )
                
                # Store only the public_id, not the full URL
                self.profile_picture.name = f"expert_profiles/{unique_id}"
                
                # Save again without triggering the save method
                super().save(update_fields=['profile_picture'])
                
                print(f"✅ Expert profile picture uploaded to Cloudinary: {result['secure_url']}")
                
            except Exception as e:
                print(f"Cloudinary upload failed for expert {self.name}: {e}")
                # Continue with local storage if Cloudinary fails

class ExpertRating(models.Model):
    expert = models.ForeignKey(ExpertProfile, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('expert', 'user')

class ExpertComment(models.Model):
    expert = models.ForeignKey(ExpertProfile, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Comment by {self.user.username} on {self.expert.name}\'s profile'

class FavoriteExperts(models.Model):
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)
    expert = models.ForeignKey(ExpertProfile, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} favorite {self.expert.user.username}"

class ExpertReaction(models.Model):
    expert = models.ForeignKey(ExpertProfile, on_delete=models.CASCADE, related_name='reactions')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reaction_type = models.CharField(max_length=10, choices=[('like', 'Like'), ('dislike', 'Dislike')])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('expert', 'user')

    def __str__(self):
        return f"{self.user.username} {self.reaction_type}d {self.expert.name}"


