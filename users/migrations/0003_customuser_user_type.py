# Generated by Django 5.1.7 on 2025-03-26 15:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_remove_customuser_user_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='user_type',
            field=models.CharField(choices=[('podcaster', 'Podcaster'), ('expert', 'Expert')], default='podcaster', max_length=10),
        ),
    ]
