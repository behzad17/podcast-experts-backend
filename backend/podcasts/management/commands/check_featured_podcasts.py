from django.core.management.base import BaseCommand
from podcasts.models import Podcast

class Command(BaseCommand):
    help = 'Check the current state of featured podcasts'

    def handle(self, *args, **options):
        featured_podcasts = Podcast.objects.filter(is_featured=True, is_approved=True)
        total_podcasts = Podcast.objects.filter(is_approved=True).count()
        
        self.stdout.write(f"Total approved podcasts: {total_podcasts}")
        self.stdout.write(f"Featured podcasts: {featured_podcasts.count()}")
        
        if featured_podcasts.exists():
            self.stdout.write("\nFeatured podcasts list:")
            for podcast in featured_podcasts:
                self.stdout.write(f"- {podcast.title} (ID: {podcast.id})")
        else:
            self.stdout.write(self.style.WARNING("No featured podcasts found!")) 