# Generated by Django 5.1.7 on 2025-04-14 12:31

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('podcasts', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='podcastcomment',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='podcasterprofile',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='podcaster_profile', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='podcast',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='podcasts', to='podcasts.podcasterprofile'),
        ),
        migrations.AddField(
            model_name='podcastlike',
            name='podcast',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likes', to='podcasts.podcast'),
        ),
        migrations.AddField(
            model_name='podcastlike',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='podcastlike',
            unique_together={('podcast', 'user')},
        ),
    ]
