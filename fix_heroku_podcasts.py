#!/usr/bin/env python
"""
Script to fix podcast images in Heroku database
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

def fix_heroku_podcasts():
    """Update Heroku database to use default podcast images"""
    print("🔧 Fixing podcast images in Heroku database...")
    
    # Update all podcasts to use default image
    podcasts = Podcast.objects.all()
    for podcast in podcasts:
        # Set to default image
        podcast.image.name = "podcast_images/default_podcast"
        podcast.save(update_fields=['image'])
        print(f"   Updated podcast '{podcast.title}' to use default image")
    
    print(f"✅ Updated {podcasts.count()} podcast images in database")

if __name__ == "__main__":
    fix_heroku_podcasts()
