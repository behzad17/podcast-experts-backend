from django.db import models
from django.utils import timezone
from users.models import CustomUser
from django.db.models import Avg

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
        CustomUser,
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
    profile_picture = models.ImageField(upload_to='expert_profiles/', blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    views = models.ManyToManyField('users.CustomUser', related_name='viewed_experts', blank=True)
    bookmarks = models.ManyToManyField('users.CustomUser', related_name='bookmarked_experts', blank=True)
    ratings = models.ManyToManyField('users.CustomUser', through='ExpertRating', related_name='rated_experts')

    def __str__(self):
        return f"{self.name} - {self.expertise}"

    def get_total_views(self):
        return self.views.count()

    def get_total_bookmarks(self):
        return self.bookmarks.count()

    def get_average_rating(self):
        return ExpertRating.objects.filter(expert=self).aggregate(Avg('rating'))['rating__avg'] or 0

class ExpertRating(models.Model):
    expert = models.ForeignKey(ExpertProfile, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('expert', 'user')

class ExpertComment(models.Model):
    expert = models.ForeignKey(ExpertProfile, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.expert.name}"

class FavoriteExperts(models.Model):
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)
    expert = models.ForeignKey(ExpertProfile, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} favorite {self.expert.user.username}"


