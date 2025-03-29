from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('podcasts', '0011_populate_default_category'),
    ]

    operations = [
        migrations.DeleteModel(
            name='PodcastReaction',
        ),
    ] 