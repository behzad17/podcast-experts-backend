from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.utils.crypto import get_random_string


class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('podcaster', 'Podcaster'),
        ('expert', 'Expert'),
    )

    groups = models.ManyToManyField(
        Group,
        related_name="customuser_groups",
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="customuser_permissions",
        blank=True
    )
    email_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=100, blank=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='podcaster')

    def generate_verification_token(self):
        self.verification_token = get_random_string(64)
        self.save()
        return self.verification_token

    def has_expert_profile(self):
        return hasattr(self, 'expert_profile')

    def has_podcaster_profile(self):
        return hasattr(self, 'podcaster_profile')


class UserProfile(models.Model):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="profile"
    )
    profile_picture = models.ImageField(
        upload_to="profiles/",
        blank=True,
        null=True
    )
