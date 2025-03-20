from django.db import models
from django.conf import settings
from users.models import UserProfile
from podcasts.models import Podcast

class Comment(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_comments'
    )
    podcast = models.ForeignKey(
        Podcast,
        on_delete=models.CASCADE,
        related_name='podcast_comments'
    )
    expert = models.ForeignKey(UserProfile, on_delete=models.CASCADE, blank=True, null=True, related_name="expert_comments")
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='replies'
    )
    likes = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='liked_comments',
        blank=True
    )
    dislikes = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='disliked_comments',
        blank=True
    )

    def __str__(self):
        return f'Comment by {self.user.username} on {self.podcast.title}'

    class Meta:
        ordering = ['-created_at']

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
