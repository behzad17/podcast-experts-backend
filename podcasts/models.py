from django.db import models

# Create your models here.
class Podcast(models.Model):
    host = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name='podcasts')
    title = models.CharField(max_length=255)
    description = models.TextField()
    podcast_link = models.URLField()

    def __str__(self):
        return self.title

