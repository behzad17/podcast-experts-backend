from django.db import models
from django.utils import timezone
from users.models import CustomUser
from django.db.models import Avg

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
    profile_picture = models.ImageField(upload_to='expert_profiles/', blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    views = models.ManyToManyField('users.CustomUser', related_name='viewed_experts', blank=True)
    bookmarks = models.ManyToManyField('users.CustomUser', related_name='bookmarked_experts', blank=True)
    ratings = models.ManyToManyField('users.CustomUser', through='ExpertRating', related_name='rated_experts')
    likes = models.ManyToManyField('users.CustomUser', related_name='liked_experts', blank=True)
    dislikes = models.ManyToManyField('users.CustomUser', related_name='disliked_experts', blank=True)

    def __str__(self):
        return f"{self.name} - {self.expertise}"

    def get_total_views(self):
        return self.views.count()

    def get_total_bookmarks(self):
        return self.bookmarks.count()

    def get_average_rating(self):
        return ExpertRating.objects.filter(expert=self).aggregate(Avg('rating'))['rating__avg'] or 0

    def get_likes_count(self):
        return self.likes.count()

    def get_dislikes_count(self):
        return self.dislikes.count()

    def is_liked_by(self, user):
        return self.likes.filter(id=user.id).exists()

    def is_disliked_by(self, user):
        return self.dislikes.filter(id=user.id).exists()

    def toggle_like(self, user):
        if self.is_liked_by(user):
            self.likes.remove(user)
            return False
        else:
            self.likes.add(user)
            self.dislikes.remove(user)
            return True

    def toggle_dislike(self, user):
        if self.is_disliked_by(user):
            self.dislikes.remove(user)
            return False
        else:
            self.dislikes.add(user)
            self.likes.remove(user)
            return True

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
    likes = models.ManyToManyField(CustomUser, related_name='liked_expert_comments', blank=True)
    dislikes = models.ManyToManyField(CustomUser, related_name='disliked_expert_comments', blank=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.expert.name}"

    def toggle_like(self, user):
        if user in self.likes.all():
            self.likes.remove(user)
            return False
        else:
            self.likes.add(user)
            if user in self.dislikes.all():
                self.dislikes.remove(user)
            return True

    def toggle_dislike(self, user):
        if user in self.dislikes.all():
            self.dislikes.remove(user)
            return False
        else:
            self.dislikes.add(user)
            if user in self.likes.all():
                self.likes.remove(user)
            return True

class FavoriteExperts(models.Model):
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)
    expert = models.ForeignKey(ExpertProfile, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} favorite {self.expert.user.username}"


