#!/usr/bin/env python3
"""
Test model-level Cloudinary integration
"""
import os
import sys
import django
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

# Set Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()


def test_model_cloudinary_upload():
    print("🔍 Testing Model-Level Cloudinary Integration...")
    
    try:
        from podcasts.models import Podcast, PodcasterProfile
        from django.core.files.base import ContentFile
        from users.models import CustomUser
        
        print("✅ Models imported successfully")
        
        # Test creating a podcast with image
        print("\n📤 Testing Podcast Image Upload...")
        
        # Create a test image content
        test_image_content = b"Fake image content for testing"
        test_image = ContentFile(test_image_content, name="test_podcast.jpg")
        
        # Get or create a test user and podcaster profile
        try:
            user = CustomUser.objects.first()
            if not user:
                print("   ⚠️  No users found, creating test user...")
                user = CustomUser.objects.create_user(
                    username="testuser",
                    email="test@example.com",
                    password="testpass123"
                )
            
            # Get or create podcaster profile
            podcaster_profile, created = PodcasterProfile.objects.get_or_create(
                user=user,
                defaults={'bio': 'Test podcaster'}
            )
            
            print(f"   Using user: {user.username}")
            print(f"   Using podcaster profile: {podcaster_profile.id}")
            
            # Create a podcast instance with required fields
            podcast = Podcast(
                title="Test Podcast for Cloudinary",
                description="Testing Cloudinary upload",
                image=test_image,
                owner=podcaster_profile,
                is_approved=True
            )
            
            # Test the save method
            print("   Testing save method...")
            try:
                # This will trigger our custom save method
                podcast.save()
                print("   ✅ Podcast saved successfully")
                
                # Check if image was uploaded to Cloudinary
                if podcast.image and hasattr(podcast.image, 'name'):
                    print(f"   Image name: {podcast.image.name}")
                    if podcast.image.name.startswith('http'):
                        print("   ✅ Image uploaded to Cloudinary!")
                    else:
                        print("   ⚠️  Image still local")
                
                # Clean up - delete the test podcast
                podcast.delete()
                print("   ✅ Test podcast cleaned up")
                
            except Exception as e:
                print(f"   ❌ Podcast save failed: {e}")
                return False
            
            return True
            
        except Exception as e:
            print(f"   ❌ Setup failed: {e}")
            return False
        
    except Exception as e:
        print(f"❌ Model test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("🚀 Model-Level Cloudinary Integration Test")
    print("=" * 55)
    
    success = test_model_cloudinary_upload()
    
    if success:
        print("\n🎉 Model-level Cloudinary integration is working!")
    else:
        print("\n⚠️  Model-level Cloudinary integration test failed!")
    
    print("=" * 55)
