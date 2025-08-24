#!/usr/bin/env python
"""
Simple script to update expert profile images to use default image
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

def update_expert_images():
    """Update all expert profile images to use default image"""
    print("🔧 Updating expert profile images...")
    
    # Update all experts to use a default image
    experts = ExpertProfile.objects.all()
    for expert in experts:
        # Set to a default image that exists
        expert.profile_picture.name = "expert_profiles/default_profile.png"
        expert.save(update_fields=['profile_picture'])
        print(f"   Updated expert '{expert.name}' to use default image")
    
    print(f"✅ Updated {experts.count()} expert profiles")

if __name__ == "__main__":
    update_expert_images()
