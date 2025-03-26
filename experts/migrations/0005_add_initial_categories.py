from django.db import migrations

def add_initial_categories(apps, schema_editor):
    ExpertCategory = apps.get_model('experts', 'ExpertCategory')
    initial_categories = [
        {
            'name': 'Audio Production',
            'description': 'Experts in sound engineering, mixing, and audio production techniques'
        },
        {
            'name': 'Content Strategy',
            'description': 'Specialists in podcast content planning, storytelling, and audience engagement'
        },
        {
            'name': 'Marketing & Growth',
            'description': 'Experts in podcast promotion, audience building, and monetization strategies'
        },
        {
            'name': 'Technical Equipment',
            'description': 'Specialists in podcast recording equipment, software, and technical setup'
        },
        {
            'name': 'Voice & Presentation',
            'description': 'Experts in voice training, public speaking, and on-air presentation skills'
        },
        {
            'name': 'Business & Monetization',
            'description': 'Specialists in podcast business models, sponsorship, and revenue generation'
        },
        {
            'name': 'Legal & Compliance',
            'description': 'Experts in podcast-related legal matters, copyright, and content compliance'
        },
        {
            'name': 'Distribution & Platforms',
            'description': 'Specialists in podcast distribution, platform optimization, and analytics'
        }
    ]
    
    for category in initial_categories:
        ExpertCategory.objects.create(**category)

def remove_initial_categories(apps, schema_editor):
    ExpertCategory = apps.get_model('experts', 'ExpertCategory')
    ExpertCategory.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('experts', '0004_expertcategory_expertprofile_categories'),
    ]

    operations = [
        migrations.RunPython(add_initial_categories, remove_initial_categories),
    ] 