#!/usr/bin/env python3
import os
import django
import requests

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from podcasts.models import Podcast
from cloudinary import cloudinary

def check_and_fix_podcast_images():
    """Check all podcast images and fix broken references"""
    podcasts = Podcast.objects.all()
    print(f'Checking {podcasts.count()} podcasts for broken images...')
    
    broken_count = 0
    fixed_count = 0
    
    for podcast in podcasts:
        if podcast.image:
            # Construct the Cloudinary URL
            try:
                image_url = cloudinary.CloudinaryImage(podcast.image).build_url()
                
                # Test if the URL is accessible
                response = requests.head(image_url, timeout=5)
                if response.status_code == 404:
                    print(f'❌ Podcast ID {podcast.id} ({podcast.title}): Broken image')
                    print(f'   Image field: {podcast.image}')
                    print(f'   URL: {image_url}')
                    
                    # Set image to None to use default
                    podcast.image = None
                    podcast.save()
                    print(f'   ✅ Fixed: Set image to None')
                    broken_count += 1
                    fixed_count += 1
                    
                elif response.status_code == 200:
                    print(f'✅ Podcast ID {podcast.id} ({podcast.title}): Image OK')
                else:
                    print(f'⚠️  Podcast ID {podcast.id} ({podcast.title}): Unexpected status {response.status_code}')
                    
            except Exception as e:
                print(f'❌ Podcast ID {podcast.id} ({podcast.title}): Error checking image - {e}')
                # Set image to None if there's an error
                podcast.image = None
                podcast.save()
                print(f'   ✅ Fixed: Set image to None due to error')
                broken_count += 1
                fixed_count += 1
        else:
            print(f'ℹ️  Podcast ID {podcast.id} ({podcast.title}): No image (using default)')
    
    print(f'\n📊 Summary:')
    print(f'   Broken images found: {broken_count}')
    print(f'   Images fixed: {fixed_count}')

if __name__ == '__main__':
    check_and_fix_podcast_images()
