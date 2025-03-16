from django.db import models
from django.utils import timezone
from users.models import CustomUser

# Create your models here.
class ExpertProfile(models.Model):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='expert_profile'
    )
    name = models.CharField(max_length=255)
    bio = models.TextField()
    expertise = models.CharField(max_length=255)
    experience_years = models.IntegerField()
    website = models.URLField(blank=True, null=True)
    social_media = models.TextField(blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.name} - {self.expertise}"
    
class FavoriteExperts(models.Model):
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)
    expert = models.ForeignKey(ExpertProfile, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} favorite {self.expert.user.username}"


