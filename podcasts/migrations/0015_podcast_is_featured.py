# Generated by Django 5.1.7 on 2025-03-30 13:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('podcasts', '0014_delete_comment'),
    ]

    operations = [
        migrations.AddField(
            model_name='podcast',
            name='is_featured',
            field=models.BooleanField(default=False),
        ),
    ]
