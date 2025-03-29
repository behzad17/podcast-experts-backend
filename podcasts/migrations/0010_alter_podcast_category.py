from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('podcasts', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='podcast',
            name='category',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='podcasts',
                to='podcasts.category'
            ),
        ),
    ] 