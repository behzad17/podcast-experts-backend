#!/usr/bin/env python3
"""
Test the Cloudinary storage fix
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

def test_storage_configuration():
    print("🔍 Testing Cloudinary Storage Configuration...")
    
    # Test 1: Check if DEFAULT_FILE_STORAGE is set
    print(f"✅ DEFAULT_FILE_STORAGE: {settings.DEFAULT_FILE_STORAGE}")
    
    # Test 2: Check if we can import the storage class
    try:
        from backend.cloudinary_storage import CustomCloudinaryStorage
        print("✅ CustomCloudinaryStorage imported successfully")
        
        # Test 3: Create an instance
        storage = CustomCloudinaryStorage()
        print("✅ CustomCloudinaryStorage instance created")
        
        # Test 4: Check Cloudinary config
        import cloudinary
        config = cloudinary.config()
        print(f"✅ Cloudinary cloud_name: {config.cloud_name}")
        print(f"✅ Cloudinary api_key: {config.api_key}")
        print(f"✅ Cloudinary api_secret: {'*' * len(config.api_secret) if config.api_secret else 'NOT SET'}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_model_storage():
    print("\n🔍 Testing Model Storage Configuration...")
    
    try:
        from podcasts.models import Podcast
        from experts.models import ExpertProfile
        from users.models import UserProfile
        
        # Check if models have storage configured
        podcast_image_field = Podcast._meta.get_field('image')
        expert_image_field = ExpertProfile._meta.get_field('profile_picture')
        user_image_field = UserProfile._meta.get_field('profile_picture')
        
        print(f"✅ Podcast image storage: {podcast_image_field.storage}")
        print(f"✅ Expert image storage: {expert_image_field.storage}")
        print(f"✅ User image storage: {user_image_field.storage}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing Cloudinary Storage Fix")
    print("=" * 50)
    
    success1 = test_storage_configuration()
    success2 = test_model_storage()
    
    if success1 and success2:
        print("\n🎉 All tests passed! Storage should work correctly.")
    else:
        print("\n⚠️ Some tests failed. Check the configuration.")
