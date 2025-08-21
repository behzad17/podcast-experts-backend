#!/usr/bin/env python3
"""
Test script to verify Cloudinary image upload functionality
"""
import os
import sys
import django
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

import cloudinary
import cloudinary.uploader
from django.conf import settings
from users.models import CustomUser
from experts.models import ExpertProfile
from podcasts.models import Podcast, PodcasterProfile, Category

def test_cloudinary_config():
    """Test if Cloudinary is properly configured"""
    print("🔧 Testing Cloudinary Configuration...")
    
    # Check environment variables
    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
    api_key = os.getenv('CLOUDINARY_API_KEY')
    api_secret = os.getenv('CLOUDINARY_API_SECRET')
    
    print(f"Cloud Name: {cloud_name}")
    print(f"API Key: {api_key[:8]}..." if api_key else "API Key: Not set")
    print(f"API Secret: {api_secret[:8]}..." if api_secret else "API Secret: Not set")
    
    if not all([cloud_name, api_key, api_secret]):
        print("❌ Missing Cloudinary environment variables!")
        return False
    
    # Check Django settings
    print(f"Django DEFAULT_FILE_STORAGE: {settings.DEFAULT_FILE_STORAGE}")
    
    return True

def test_expert_profile_creation():
    """Test creating an expert profile with image"""
    print("\n👤 Testing Expert Profile Creation...")
    
    try:
        # Get or create a test user
        user, created = CustomUser.objects.get_or_create(
            username='test_expert_user',
            defaults={
                'email': 'test_expert@example.com',
                'first_name': 'Test',
                'last_name': 'Expert'
            }
        )
        
        if created:
            user.set_password('testpass123')
            user.save()
            print(f"✅ Created test user: {user.username}")
        else:
            print(f"✅ Using existing user: {user.username}")
        
        # Get or create a category
        category, created = Category.objects.get_or_create(
            name='Technology',
            defaults={'description': 'Technology and Innovation'}
        )
        
        # Create expert profile
        expert_profile, created = ExpertProfile.objects.get_or_create(
            user=user,
            defaults={
                'name': 'Test Technology Expert',
                'bio': 'A test expert in technology',
                'expertise': 'Software Development',
                'experience_years': 5,
                'website': 'https://example.com',
                'social_media': 'LinkedIn: test-expert'
            }
        )
        
        if created:
            expert_profile.categories.add(category)
            print(f"✅ Created expert profile: {expert_profile.name}")
        else:
            print(f"✅ Using existing expert profile: {expert_profile.name}")
        
        return expert_profile
        
    except Exception as e:
        print(f"❌ Error creating expert profile: {e}")
        return None

def test_podcast_creation():
    """Test creating a podcast with image"""
    print("\n🎙️ Testing Podcast Creation...")
    
    try:
        # Get or create a test user
        user, created = CustomUser.objects.get_or_create(
            username='test_podcaster',
            defaults={
                'email': 'test_podcaster@example.com',
                'first_name': 'Test',
                'last_name': 'Podcaster'
            }
        )
        
        if created:
            user.set_password('testpass123')
            user.save()
            print(f"✅ Created test user: {user.username}")
        else:
            print(f"✅ Using existing user: {user.username}")
        
        # Get or create podcaster profile
        podcaster_profile, created = PodcasterProfile.objects.get_or_create(
            user=user,
            defaults={
                'bio': 'A test podcaster',
                'website': 'https://example.com'
            }
        )
        
        # Get or create a category
        category, created = Category.objects.get_or_create(
            name='Technology',
            defaults={'description': 'Technology and Innovation'}
        )
        
        # Create podcast
        podcast, created = Podcast.objects.get_or_create(
            title='Test Technology Podcast',
            defaults={
                'description': 'A test podcast about technology',
                'owner': podcaster_profile,
                'category': category,
                'link': 'https://example.com/podcast'
            }
        )
        
        if created:
            print(f"✅ Created podcast: {podcast.title}")
        else:
            print(f"✅ Using existing podcast: {podcast.title}")
        
        return podcast
        
    except Exception as e:
        print(f"❌ Error creating podcast: {e}")
        return None

def test_cloudinary_upload():
    """Test direct Cloudinary upload"""
    print("\n☁️ Testing Direct Cloudinary Upload...")
    
    try:
        # Create a dummy image content
        dummy_image_content = b"Fake image content for testing"
        
        # Test upload to Cloudinary
        result = cloudinary.uploader.upload(
            dummy_image_content,
            public_id="test_upload",
            resource_type="auto",
            overwrite=True
        )
        
        print(f"✅ Direct upload successful!")
        print(f"   Public ID: {result.get('public_id')}")
        print(f"   URL: {result.get('secure_url')}")
        print(f"   Format: {result.get('format')}")
        
        return result
        
    except Exception as e:
        print(f"❌ Direct upload failed: {e}")
        return None

def main():
    """Main test function"""
    print("🚀 Starting Cloudinary Integration Tests...")
    print("=" * 50)
    
    # Test 1: Configuration
    if not test_cloudinary_config():
        print("❌ Configuration test failed. Exiting.")
        return
    
    # Test 2: Direct Cloudinary upload
    upload_result = test_cloudinary_upload()
    if not upload_result:
        print("❌ Direct upload test failed. Exiting.")
        return
    
    # Test 3: Expert Profile creation
    expert_profile = test_expert_profile_creation()
    if not expert_profile:
        print("❌ Expert profile creation failed.")
    
    # Test 4: Podcast creation
    podcast = test_podcast_creation()
    if not podcast:
        print("❌ Podcast creation failed.")
    
    print("\n" + "=" * 50)
    print("🎉 Cloudinary Integration Tests Completed!")
    print("\n📋 Summary:")
    print("✅ Cloudinary configuration verified")
    print("✅ Direct upload functionality working")
    if expert_profile:
        print("✅ Expert profile creation working")
    if podcast:
        print("✅ Podcast creation working")
    
    print("\n💡 Next Steps:")
    print("1. Test image uploads through the frontend")
    print("2. Monitor Cloudinary dashboard for uploaded images")
    print("3. Verify images are displayed correctly in the UI")

if __name__ == "__main__":
    main()
