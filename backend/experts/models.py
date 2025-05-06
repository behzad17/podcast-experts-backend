from django.db import models
from django.utils import timezone
from users.models import CustomUser


class ExpertCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Expert Categories"


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
        CustomUser,
        related_name='viewed_experts',
        blank=True
    )
    bookmarks = models.ManyToManyField(
        CustomUser,
        related_name='bookmarked_experts',
        blank=True
    )

    def __str__(self):
        return f"{self.name} - {self.expertise}"

    def get_total_views(self):
        return self.views.count()

    def get_total_bookmarks(self):
        return self.bookmarks.count()


class ExpertComment(models.Model):
    expert = models.ForeignKey(
        ExpertProfile,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='expert_comments'
    )
    content = models.TextField()
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies'
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.expert.name}"


class ExpertReaction(models.Model):
    REACTION_TYPES = (
        ('like', 'Like'),
        ('dislike', 'Dislike'),
    )

    expert = models.ForeignKey(
        ExpertProfile,
        on_delete=models.CASCADE,
        related_name='reactions'
    )
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='expert_reactions'
    )
    reaction_type = models.CharField(
        max_length=10,
        choices=REACTION_TYPES
    )
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('expert', 'user')

    def __str__(self):
        return f"{self.user.username} {self.reaction_type}d {self.expert.name}" 