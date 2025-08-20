from django.core.management.base import BaseCommand
from django.conf import settings
import os
import cloudinary
import cloudinary.uploader
from experts.models import ExpertProfile
from podcasts.models import Podcast


class Command(BaseCommand):
    help = 'Migrate existing local images to Cloudinary'

    def handle(self, *args, **options):
        self.stdout.write('Starting image migration to Cloudinary...')
        
        # Configure Cloudinary
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_STORAGE['CLOUD_NAME'],
            api_key=settings.CLOUDINARY_STORAGE['API_KEY'],
            api_secret=settings.CLOUDINARY_STORAGE['API_SECRET']
        )
        
        # Migrate expert profile pictures
        self.stdout.write('Migrating expert profile pictures...')
        experts = ExpertProfile.objects.filter(profile_picture__isnull=False)
        
        for expert in experts:
            if expert.profile_picture and expert.profile_picture.name:
                local_path = os.path.join(
                    settings.MEDIA_ROOT, 
                    expert.profile_picture.name
                )
                
                if os.path.exists(local_path):
                    try:
                        # Upload to Cloudinary
                        cloudinary.uploader.upload(
                            local_path,
                            public_id=expert.profile_picture.name.replace(
                                '.jpg', ''
                            ).replace('.png', ''),
                            resource_type='image',
                            overwrite=True
                        )
                        
                        # Update the model to use Cloudinary URL
                        expert.profile_picture.name = expert.profile_picture.name
                        expert.save()
                        
                        self.stdout.write(
                            self.style.SUCCESS(
                                f'Successfully migrated expert {expert.name}: '
                                f'{expert.profile_picture.name}'
                            )
                        )
                    except Exception as e:
                        self.stdout.write(
                            self.style.ERROR(
                                f'Error migrating expert {expert.name}: {str(e)}'
                            )
                        )
                else:
                    self.stdout.write(
                        self.style.WARNING(
                            f'Local file not found for expert {expert.name}: '
                            f'{local_path}'
                        )
                    )
        
        # Migrate podcast images
        self.stdout.write('Migrating podcast images...')
        podcasts = Podcast.objects.filter(image__isnull=False)
        
        for podcast in podcasts:
            if podcast.image and podcast.image.name:
                local_path = os.path.join(
                    settings.MEDIA_ROOT, 
                    podcast.image.name
                )
                
                if os.path.exists(local_path):
                    try:
                        # Upload to Cloudinary
                        cloudinary.uploader.upload(
                            local_path,
                            public_id=podcast.image.name.replace(
                                '.jpg', ''
                            ).replace('.png', ''),
                            resource_type='image',
                            overwrite=True
                        )
                        
                        # Update the model to use Cloudinary URL
                        podcast.image.name = podcast.image.name
                        podcast.save()
                        
                        self.stdout.write(
                            self.style.SUCCESS(
                                f'Successfully migrated podcast {podcast.title}: '
                                f'{podcast.image.name}'
                            )
                        )
                    except Exception as e:
                        self.stdout.write(
                            self.style.ERROR(
                                f'Error migrating podcast {podcast.title}: {str(e)}'
                            )
                        )
                else:
                    self.stdout.write(
                        self.style.WARNING(
                            f'Local file not found for podcast {podcast.title}: '
                            f'{local_path}'
                        )
                    )
        
        self.stdout.write(
            self.style.SUCCESS('Image migration completed!')
        )
