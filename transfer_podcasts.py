import os
import django
from datetime import datetime

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from podcasts.models import Podcast, Category, PodcasterProfile
from podcast2.models import Podcast2, Category2, Podcaster2Profile
from users.models import CustomUser


def transfer_podcaster_profiles():
    print("Transferring podcaster profiles...")
    profiles = PodcasterProfile.objects.all()
    for profile in profiles:
        Podcaster2Profile.objects.get_or_create(
            user=profile.user,
            defaults={
                'bio': profile.bio,
                'website': profile.website,
                'social_links': profile.social_links
            }
        )
    print(f"Transferred {profiles.count()} podcaster profiles")


def transfer_categories():
    print("Transferring categories...")
    categories = Category.objects.all()
    for category in categories:
        Category2.objects.get_or_create(
            name=category.name,
            defaults={
                'description': category.description,
                'slug': category.slug
            }
        )
    print(f"Transferred {categories.count()} categories")


def transfer_podcasts():
    print("Transferring podcasts...")
    podcasts = Podcast.objects.all()
    for podcast in podcasts:
        # Get or create category2
        category2 = Category2.objects.get(name=podcast.category.name) if podcast.category else None
        
        # Get or create podcaster2 profile
        podcaster2_profile = Podcaster2Profile.objects.get(user=podcast.owner.user)
        
        # Create podcast2
        podcast2, created = Podcast2.objects.get_or_create(
            title=podcast.title,
            defaults={
                'description': podcast.description,
                'image': podcast.image,
                'link': podcast.link,
                'category': category2,
                'owner': podcaster2_profile,
                'is_approved': podcast.is_approved,
                'created_at': podcast.created_at,
                'updated_at': podcast.updated_at
            }
        )
        
        # Transfer likes and dislikes
        for user in podcast.likes.all():
            podcast2.likes.add(user)
        for user in podcast.dislikes.all():
            podcast2.dislikes.add(user)
            
    print(f"Transferred {podcasts.count()} podcasts")


def main():
    print("Starting podcast transfer...")
    transfer_podcaster_profiles()
    transfer_categories()
    transfer_podcasts()
    print("Transfer completed!")


if __name__ == "__main__":
    main() 