from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from podcasts.models import Category, PodcasterProfile
from experts.models import ExpertProfile
from podcasts.models import Podcast


User = get_user_model()


class Command(BaseCommand):
    help = 'Sets up initial data for the application'

    def handle(self, *args, **kwargs):
        # Create categories
        categories = [
            'Technology',
            'Business',
            'Science',
            'Health',
            'Education',
            'Entertainment',
            'Sports',
            'News',
            'Arts',
            'Lifestyle'
        ]
        
        for category_name in categories:
            Category.objects.get_or_create(name=category_name)
        
        self.stdout.write(
            self.style.SUCCESS('Successfully created categories')
        )

        # Create a test expert
        expert_user, created = User.objects.get_or_create(
            username='testexpert',
            email='expert@example.com',
            defaults={
                'is_active': True,
                'is_staff': False
            }
        )
        if created:
            expert_user.set_password('testpass123')
            expert_user.save()
            ExpertProfile.objects.create(
                user=expert_user,
                bio='Test expert profile',
                expertise='Technology, Business',
                experience_years=5
            )
            self.stdout.write(
                self.style.SUCCESS('Successfully created test expert')
            )

        # Create a podcaster profile
        podcaster_profile, created = PodcasterProfile.objects.get_or_create(
            user=expert_user,
            defaults={
                'bio': 'Test podcaster profile'
            }
        )

        # Create a test podcast
        podcast, created = Podcast.objects.get_or_create(
            title='Test Podcast',
            description='A test podcast for development',
            category=Category.objects.first(),
            owner=podcaster_profile,
            is_approved=True
        )
        if created:
            self.stdout.write(
                self.style.SUCCESS('Successfully created test podcast')
            )

        self.stdout.write(
            self.style.SUCCESS('Initial data setup completed successfully')
        ) 