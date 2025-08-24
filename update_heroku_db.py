#!/usr/bin/env python
"""
Script to update Heroku database to use default images
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

from experts.models import ExpertProfile

def update_heroku_database():
    """Update Heroku database to use default images"""
    print("🔧 Updating Heroku database...")
    
    # Update all experts to use default image
    experts = ExpertProfile.objects.all()
    for expert in experts:
        # Set to default image
        expert.profile_picture.name = "expert_profiles/default_profile"
        expert.save(update_fields=['profile_picture'])
        print(f"   Updated expert '{expert.name}' to use default image")
    
    print(f"✅ Updated {experts.count()} expert profiles in database")

if __name__ == "__main__":
    update_heroku_database()
