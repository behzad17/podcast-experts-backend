from django.core.management.base import BaseCommand
from experts.models import ExpertProfile
from podcasts.models import Podcast


class Command(BaseCommand):
    help = 'Clean up broken image references in the database'
    
    def handle(self, *args, **options):
        self.stdout.write('Starting cleanup of broken image references...')
        
        # Clean up expert profile pictures
        self.stdout.write('Cleaning up expert profile pictures...')
        experts = ExpertProfile.objects.all()
        
        for expert in experts:
            if expert.profile_picture and expert.profile_picture.name:
                # Check if the image name contains the broken pattern
                if 'Black_Siorc_Logo' in expert.profile_picture.name:
                    self.stdout.write(
                        f'Removing broken image reference for expert: '
                        f'{expert.name}'
                    )
                    expert.profile_picture = None
                    expert.save()
        
        # Clean up podcast images
        self.stdout.write('Cleaning up podcast images...')
        podcasts = Podcast.objects.all()
        
        for podcast in podcasts:
            if podcast.image and podcast.image.name:
                # Check if the image name contains the broken pattern
                if 'Black_Siorc_Logo' in podcast.image.name:
                    self.stdout.write(
                        f'Removing broken image reference for podcast: '
                        f'{podcast.title}'
                    )
                    podcast.image = None
                    podcast.save()
        
        self.stdout.write(
            self.style.SUCCESS('Cleanup completed successfully!')
        )
