from django.core.management.base import BaseCommand
from experts.models import ExpertProfile
import cloudinary
import cloudinary.uploader
from django.conf import settings


class Command(BaseCommand):
    help = (
        'Upload default profile image to Cloudinary and update expert profiles'
    )
    
    def handle(self, *args, **options):
        self.stdout.write('Starting default image upload to Cloudinary...')
        
        try:
            # Configure Cloudinary
            cloudinary.config(
                cloud_name=settings.CLOUDINARY_STORAGE['CLOUD_NAME'],
                api_key=settings.CLOUDINARY_STORAGE['API_KEY'],
                api_secret=settings.CLOUDINARY_STORAGE['API_SECRET']
            )
            
            # Create a simple 1x1 transparent PNG as default image
            # This is a minimal transparent PNG file
            default_image_data = (
                b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01'
                b'\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89'
                b'\x00\x00\x00\nIDATx\x9cc\x00\x00\x00\x02\x00\x01\xe5'
                b'\x27\xde\xfc\x00\x00\x00\x00IEND\xaeB`\x82'
            )
            
            # Upload to Cloudinary
            result = cloudinary.uploader.upload(
                default_image_data,
                public_id='expert_profiles/default_profile',
                resource_type='image',
                format='png',
                overwrite=True
            )
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Default expert image uploaded successfully: '
                    f'{result["secure_url"]}'
                )
            )
            
            # Also upload a default podcast image
            podcast_result = cloudinary.uploader.upload(
                default_image_data,
                public_id='podcast_images/default_podcast',
                resource_type='image',
                format='png',
                overwrite=True
            )
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Default podcast image uploaded successfully: '
                    f'{podcast_result["secure_url"]}'
                )
            )
            
            # Count experts without valid images
            experts_without_images = ExpertProfile.objects.filter(
                profile_picture__isnull=True
            )
            
            if experts_without_images.exists():
                self.stdout.write(
                    f'Found {experts_without_images.count()} '
                    f'experts without profile pictures'
                )
            
            self.stdout.write(
                self.style.SUCCESS(
                    'Default image upload completed successfully!'
                )
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error uploading default image: {str(e)}')
            )
