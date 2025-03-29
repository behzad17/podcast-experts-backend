# Generated by Django 5.1.7 on 2025-03-29 17:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_messages', '0003_message_is_read_message_read_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='attachment',
            field=models.FileField(blank=True, null=True, upload_to='message_attachments/'),
        ),
        migrations.AddField(
            model_name='message',
            name='attachment_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='message',
            name='attachment_type',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
