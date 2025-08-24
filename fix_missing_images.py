#!/usr/bin/env python
"""
Script to fix missing images in Cloudinary by re-uploading them
and updating the database with correct public_ids
"""

import os
import sys
import django
from pathlib import Path

# Add the backend directory to Python path
sys.path.append(str(Path(__file__).parent / 'backend'))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

import cloudinary
import cloudinary.uploader
from django.conf import settings
from podcasts.models import Podcast
from experts.models import ExpertProfile


def upload_image_to_cloudinary(image_path, public_id):
    """Upload an image to Cloudinary"""
    try:
        result = cloudinary.uploader.upload(
            image_path,
            public_id=public_id,
            resource_type="auto",
            overwrite=True
        )
        print(f"✅ Uploaded: {public_id} -> {result['secure_url']}")
        return result['public_id']
    except Exception as e:
        print(f"❌ Failed to upload {public_id}: {e}")
        return None


def fix_podcast_images():
    """Fix podcast images by re-uploading to Cloudinary"""
    print("\n🔧 Fixing Podcast Images...")
    
    podcasts = Podcast.objects.all()
    for podcast in podcasts:
        if podcast.image and hasattr(podcast.image, 'path'):
            # Check if the image file exists
            if os.path.exists(podcast.image.path):
                # Create a unique public_id
                unique_id = f"{podcast.title}_{podcast.id}".replace(' ', '_').lower()
                public_id = f"podcast_images/{unique_id}"
                
                # Upload to Cloudinary
                cloudinary_id = upload_image_to_cloudinary(
                    podcast.image.path, public_id
                )
                if cloudinary_id:
                    # Update the database
                    podcast.image.name = cloudinary_id
                    podcast.save(update_fields=['image'])
                    print(f"   Updated podcast '{podcast.title}' with Cloudinary ID: {cloudinary_id}")
            else:
                print(f"   ⚠️  Image file not found for podcast '{podcast.title}': {podcast.image.path}")


def fix_expert_images():
    """Fix expert profile images by re-uploading to Cloudinary"""
    print("\n🔧 Fixing Expert Profile Images...")
    
    experts = ExpertProfile.objects.all()
    for expert in experts:
        if expert.profile_picture and hasattr(expert.profile_picture, 'path'):
            # Check if the image file exists
            if os.path.exists(expert.profile_picture.path):
                # Create a unique public_id
                unique_id = f"{expert.user.username}_{expert.id}".replace(' ', '_').lower()
                public_id = f"expert_profiles/{unique_id}"
                
                # Upload to Cloudinary
                cloudinary_id = upload_image_to_cloudinary(
                    expert.profile_picture.path, public_id
                )
                if cloudinary_id:
                    # Update the database
                    expert.profile_picture.name = cloudinary_id
                    expert.save(update_fields=['profile_picture'])
                    print(f"   Updated expert '{expert.name}' with Cloudinary ID: {cloudinary_id}")
            else:
                print(f"   ⚠️  Image file not found for expert '{expert.name}': {expert.profile_picture.path}")


def main():
    """Main function to fix all missing images"""
    print("🚀 Starting Image Fix Process...")
    
    # Configure Cloudinary
    try:
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET
        )
        print(f"✅ Cloudinary configured with cloud: {settings.CLOUDINARY_CLOUD_NAME}")
    except Exception as e:
        print(f"❌ Failed to configure Cloudinary: {e}")
        return
    
    # Fix podcast images
    fix_podcast_images()
    
    # Fix expert images
    fix_expert_images()
    
    print("\n🎉 Image fix process completed!")
    print("💡 You may need to restart your Django server for changes to take effect.")


if __name__ == "__main__":
    main()
