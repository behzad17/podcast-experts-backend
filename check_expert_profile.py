#!/usr/bin/env python3
"""
Check expert profile database data
"""
import os
import django
from django.conf import settings

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def check_expert_profile():
    from experts.models import ExpertProfile
    
    try:
        expert = ExpertProfile.objects.get(id=9)
        print("🔍 Expert Profile Database Check")
        print("=" * 50)
        print(f"ID: {expert.id}")
        print(f"Name: {expert.name}")
        print(f"User: {expert.user.username}")
        print(f"Profile Picture Field: {expert.profile_picture}")
        print(f"Profile Picture Name: {expert.profile_picture.name if expert.profile_picture else 'None'}")
        print(f"Profile Picture URL Property: {expert.profile_picture_url}")
        print(f"Has Profile Picture: {bool(expert.profile_picture)}")
        print(f"Is Approved: {expert.is_approved}")
        
        # Check if the image field has a value
        if expert.profile_picture:
            print(f"Image Field Value: {expert.profile_picture}")
            print(f"Image Field Name: {expert.profile_picture.name}")
            print(f"Image Field URL: {expert.profile_picture.url}")
        else:
            print("❌ No profile picture uploaded - using default")
            
    except ExpertProfile.DoesNotExist:
        print("❌ Expert profile with ID 9 not found")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_expert_profile()
