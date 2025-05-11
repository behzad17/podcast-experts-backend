from django.db import models
from django.utils import timezone
from users.models import CustomUser


class Podcast(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    host = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='hosted_podcasts'
    )
    guests = models.ManyToManyField(
        'experts.ExpertProfile',
        related_name='appearances'
    )
    audio_file = models.FileField(upload_to='podcasts/')
    duration = models.DurationField()
    release_date = models.DateTimeField(default=timezone.now)
    cover_image = models.ImageField(
        upload_to='podcast_covers/',
        blank=True,
        null=True
    )
    is_featured = models.BooleanField(default=False)
    views = models.ManyToManyField(
        CustomUser,
        related_name='viewed_podcasts',
        blank=True
    )

    def get_likes_count(self):
        return self.reactions.filter(reaction_type='like').count()

    def get_dislikes_count(self):
        return self.reactions.filter(reaction_type='dislike').count()

    def __str__(self):
        return self.title

    def get_total_views(self):
        return self.views.count() 