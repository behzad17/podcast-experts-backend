from django.db import models
from django.utils import timezone
from users.models import CustomUser


class ExpertCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class ExpertProfile(models.Model):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='expert_profile'
    )
    name = models.CharField(max_length=255)
    bio = models.TextField()
    expertise = models.CharField(max_length=255)
    categories = models.ManyToManyField(
        ExpertCategory,
        related_name='experts'
    )
    experience_years = models.IntegerField()
    website = models.URLField(blank=True, null=True)
    social_media = models.TextField(blank=True, null=True)
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

    def get_likes_count(self):
        return self.reactions.filter(reaction_type='like').count()

    def get_dislikes_count(self):
        return self.reactions.filter(reaction_type='dislike').count()

    def __str__(self):
        return f"{self.name} - {self.expertise}"

    def get_total_views(self):
        return self.views.count() 