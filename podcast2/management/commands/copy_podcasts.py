from django.core.management.base import BaseCommand
from podcasts.models import Podcast, Category
from podcast2.models import Podcast2, Category2, Podcaster2Profile
from django.core.files import File
import os

class Command(BaseCommand):
    help = 'Copy podcasts from podcasts app to podcast2 app'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting podcast migration...')
        
        # First, copy categories
        self.stdout.write('Copying categories...')
        category_mapping = {}
        for category in Category.objects.all():
            category2, created = Category2.objects.get_or_create(
                name=category.name,
                defaults={
                    'description': category.description,
                    'slug': category.slug
                }
            )
            category_mapping[category.id] = category2
            if created:
                self.stdout.write(f'Created category: {category2.name}')

        # Copy podcasts
        self.stdout.write('Copying podcasts...')
        for podcast in Podcast.objects.all():
            # Get or create podcaster profile
            podcaster_profile = Podcaster2Profile.get_or_create_profile(podcast.owner.user)

            # Create the podcast2 instance
            podcast2 = Podcast2.objects.create(
                title=podcast.title,
                description=podcast.description,
                owner=podcaster_profile,
                category=category_mapping.get(podcast.category.id) if podcast.category else None,
                link=podcast.link,
                is_approved=podcast.is_approved,
                created_at=podcast.created_at,
                updated_at=podcast.updated_at,
            )

            # Copy image if exists
            if podcast.image:
                try:
                    # Open the original image file
                    with open(podcast.image.path, 'rb') as img_file:
                        # Create a Django File object
                        django_file = File(img_file)
                        # Save to the new podcast2 instance
                        podcast2.image.save(
                            os.path.basename(podcast.image.name),
                            django_file,
                            save=True
                        )
                except Exception as e:
                    self.stdout.write(
                        self.style.WARNING(
                            f'Failed to copy image for podcast {podcast.title}: {str(e)}'
                        )
                    )

            # Copy likes
            for user in podcast.likes.all():
                podcast2.likes.add(user)

            # Copy dislikes
            for user in podcast.dislikes.all():
                podcast2.dislikes.add(user)

            self.stdout.write(f'Copied podcast: {podcast2.title}')

        self.stdout.write(self.style.SUCCESS('Successfully copied all podcasts!')) 