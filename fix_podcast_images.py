#!/usr/bin/env python
"""
Script to fix podcast images by updating them to use default image
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

from podcasts.models import Podcast

def fix_podcast_images():
    """Update all podcast images to use default image"""
    print("🔧 Fixing podcast images...")
    
    # Update all podcasts to use default image
    podcasts = Podcast.objects.all()
    for podcast in podcasts:
        # Set to default image
        podcast.image.name = "podcast_images/default_podcast.png"
        podcast.save(update_fields=['image'])
        print(f"   Updated podcast '{podcast.title}' to use default image")
    
    print(f"✅ Updated {podcasts.count()} podcast images")

if __name__ == "__main__":
    fix_podcast_images()
