from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class ExpertProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='expert_profile')
    bio = models.TextField()
    specialty = models.CharField(max_length=200)
    experience_years = models.IntegerField(default=0)
    profile_picture = models.ImageField(upload_to='experts/', blank=True, null=True)
    categories = models.ManyToManyField(Category, blank=True)
    is_featured = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(User, related_name='liked_experts', blank=True)

    def __str__(self):
        return f"{self.user.username}'s Expert Profile"

    @property
    def likes_count(self):
        return self.likes.count()

    @property
    def profile_picture_url(self):
        if self.profile_picture:
            return self.profile_picture.url
        return None 