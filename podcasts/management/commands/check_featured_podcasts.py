from django.core.management.base import BaseCommand
from podcasts.models import Podcast

class Command(BaseCommand):
    help = 'Check the state of featured podcasts'

    def handle(self, *args, **options):
        # Get all approved podcasts
        approved_podcasts = Podcast.objects.filter(is_approved=True)
        total_approved = approved_podcasts.count()
        
        # Get featured podcasts
        featured_podcasts = approved_podcasts.filter(is_featured=True)
        total_featured = featured_podcasts.count()
        
        self.stdout.write(self.style.SUCCESS(f'Total approved podcasts: {total_approved}'))
        self.stdout.write(self.style.SUCCESS(f'Total featured podcasts: {total_featured}'))
        
        if total_featured > 0:
            self.stdout.write('\nFeatured podcasts:')
            for podcast in featured_podcasts:
                self.stdout.write(f'- {podcast.title} (ID: {podcast.id})')
        else:
            self.stdout.write(self.style.WARNING('No featured podcasts found.')) 