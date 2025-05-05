from django.core.management.base import BaseCommand
from django.utils.text import slugify
from podcasts.models import Category, PodcasterProfile, Podcast
from experts.models import ExpertCategory, ExpertProfile
from users.models import CustomUser


class Command(BaseCommand):
    help = 'Creates sample data for the application'

    def handle(self, *args, **options):
        # Create sample users
        users = []
        for i in range(1, 4):
            user = CustomUser.objects.create_user(
                username=f'user{i}',
                email=f'user{i}@example.com',
                password='password123'
            )
            users.append(user)
            print(f'Created user: {user.username}')

        # Create podcaster users
        podcasters = []
        for i in range(1, 3):
            podcaster = CustomUser.objects.create_user(
                username=f'podcaster{i}',
                email=f'podcaster{i}@example.com',
                password='password123'
            )
            podcasters.append(podcaster)
            print(f'Created podcaster: {podcaster.username}')

        # Create expert users
        experts = []
        for i in range(1, 7):
            expert = CustomUser.objects.create_user(
                username=f'expert{i}',
                email=f'expert{i}@example.com',
                password='password123'
            )
            experts.append(expert)
            print(f'Created expert user: {expert.username}')

        # Create categories
        podcast_categories = [
            'Technology', 'Business', 'Science', 'Health', 
            'Education', 'Entertainment'
        ]
        for category_name in podcast_categories:
            category, created = Category.objects.get_or_create(
                name=category_name,
                defaults={'description': f'Podcasts about {category_name.lower()}'}
            )
            print(f'Created podcast category: {category.name}')

        expert_categories = [
            'Technology', 'Business', 'Science', 'Health', 
            'Education', 'Marketing'
        ]
        for category_name in expert_categories:
            category, created = ExpertCategory.objects.get_or_create(
                name=category_name,
                defaults={'description': f'Experts in {category_name.lower()}'}
            )
            print(f'Created expert category: {category.name}')

        # Create podcaster profiles
        podcaster_profiles = []
        for podcaster in podcasters:
            profile = PodcasterProfile.objects.create(
                user=podcaster,
                bio=(
                    f'Professional podcaster with years of experience in '
                    f'{podcaster.username}'
                ),
                website=f'https://{podcaster.username}.com',
                social_links={
                    'twitter': f'@{podcaster.username}',
                    'linkedin': f'linkedin.com/in/{podcaster.username}'
                }
            )
            podcaster_profiles.append(profile)
            print(f'Created podcaster profile for: {podcaster.username}')

        # Create podcasts
        podcast_titles = [
            'Tech Talk Today',
            'Business Insights',
            'Science Weekly',
            'Health Matters',
            'Education Revolution',
            'Entertainment Buzz'
        ]
        
        for i, title in enumerate(podcast_titles):
            podcast = Podcast.objects.create(
                title=title,
                description=f'An engaging podcast about {title.lower()}',
                owner=podcaster_profiles[i % len(podcaster_profiles)],
                category=Category.objects.get(name=podcast_categories[i]),
                link=f'https://example.com/podcasts/{slugify(title)}',
                is_approved=True,
                is_featured=(i < 3)  # First 3 podcasts are featured
            )
            print(f'Created podcast: {podcast.title}')

        # Create expert profiles
        expert_names = [
            'Dr. Sarah Johnson',
            'John Smith',
            'Dr. Michael Chen',
            'Emily Davis',
            'Prof. Robert Wilson',
            'Lisa Anderson'
        ]
        
        expert_expertise = [
            'Artificial Intelligence',
            'Business Strategy',
            'Medical Research',
            'Educational Technology',
            'Digital Marketing',
            'Environmental Science'
        ]
        
        for i, expert in enumerate(experts):
            expert_profile = ExpertProfile.objects.create(
                user=expert,
                name=expert_names[i],
                bio=f'Professional expert in {expert_expertise[i].lower()} with '
                    f'years of experience',
                expertise=expert_expertise[i],
                experience_years=5 + i,
                website=f'https://{slugify(expert_names[i])}.com',
                social_media=f'Twitter: @{slugify(expert_names[i])}',
                is_approved=True,
                is_featured=(i < 3)  # First 3 experts are featured
            )
            # Add categories to expert
            category = ExpertCategory.objects.get(name=expert_categories[i])
            expert_profile.categories.add(category)
            print(f'Created expert profile: {expert_profile.name}')

        self.stdout.write(self.style.SUCCESS('Successfully created sample data')) 