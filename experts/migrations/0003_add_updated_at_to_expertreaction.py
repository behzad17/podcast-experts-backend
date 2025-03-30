from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('experts', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='expertreaction',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ] 