# Generated by Django 5.1.7 on 2025-04-14 12:31

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('experts', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='expertcomment',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='expertprofile',
            name='bookmarks',
            field=models.ManyToManyField(blank=True, related_name='bookmarked_experts', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='expertprofile',
            name='categories',
            field=models.ManyToManyField(related_name='experts', to='experts.expertcategory'),
        ),
        migrations.AddField(
            model_name='expertprofile',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='expert_profile', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='expertprofile',
            name='views',
            field=models.ManyToManyField(blank=True, related_name='viewed_experts', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='expertcomment',
            name='expert',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='experts.expertprofile'),
        ),
        migrations.AddField(
            model_name='expertrating',
            name='expert',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='experts.expertprofile'),
        ),
        migrations.AddField(
            model_name='expertrating',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='expertreaction',
            name='expert',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reactions', to='experts.expertprofile'),
        ),
        migrations.AddField(
            model_name='expertreaction',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='favoriteexperts',
            name='expert',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='experts.expertprofile'),
        ),
        migrations.AddField(
            model_name='favoriteexperts',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='expertrating',
            unique_together={('expert', 'user')},
        ),
        migrations.AlterUniqueTogether(
            name='expertreaction',
            unique_together={('expert', 'user')},
        ),
    ]
