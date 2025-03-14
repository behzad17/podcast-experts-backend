# Generated by Django 5.1.7 on 2025-03-10 03:06

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
            model_name='expertprofile',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='expert_profile', to=settings.AUTH_USER_MODEL),
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
    ]
