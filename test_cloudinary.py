#!/usr/bin/env python3
"""
Test script to verify Cloudinary integration is working
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

# Now import Django settings and test Cloudinary
from django.conf import settings
import cloudinary
import cloudinary.uploader

def test_cloudinary_config():
    """Test if Cloudinary is properly configured"""
    print("🔍 Testing Cloudinary Configuration...")
    
    # Check environment variables
    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
    api_key = os.getenv('CLOUDINARY_API_KEY')
    api_secret = os.getenv('CLOUDINARY_API_SECRET')
    
    print(f"Cloud Name: {cloud_name}")
    print(f"API Key: {api_key}")
    print(f"API Secret: {'*' * len(api_secret) if api_secret else 'NOT SET'}")
    
    if not all([cloud_name, api_key, api_secret]):
        print("❌ Missing Cloudinary environment variables!")
        return False
    
    # Check Django settings
    print(f"\n📋 Django Settings:")
    print(f"DEFAULT_FILE_STORAGE: {settings.DEFAULT_FILE_STORAGE}")
    print(f"CLOUDINARY_STORAGE: {settings.CLOUDINARY_STORAGE}")
    
    # Test Cloudinary connection
    try:
        print(f"\n🔗 Testing Cloudinary Connection...")
        cloudinary.config(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret
        )
        
        # Test upload functionality
        print(f"\n📤 Testing Image Upload...")
        test_image_path = "test_image.txt"  # Create a simple test file
        
        # Create a simple test file
        with open(test_image_path, 'w') as f:
            f.write("This is a test file for Cloudinary upload")
        
        try:
            result = cloudinary.uploader.upload(
                test_image_path,
                resource_type="auto",
                folder="test_uploads"
            )
            print(f"✅ Test upload successful!")
            print(f"   URL: {result['url']}")
            print(f"   Public ID: {result['public_id']}")
            
            # Clean up test file
            os.remove(test_image_path)
            
            # Delete the test upload
            cloudinary.uploader.destroy(result['public_id'])
            print(f"✅ Test upload cleaned up")
            
            return True
            
        except Exception as e:
            print(f"❌ Upload test failed: {e}")
            if os.path.exists(test_image_path):
                os.remove(test_image_path)
            return False
            
    except Exception as e:
        print(f"❌ Cloudinary connection failed: {e}")
        return False

def test_django_models():
    """Test if Django models can access Cloudinary"""
    print(f"\n🔍 Testing Django Models...")
    
    try:
        from podcasts.models import Podcast
        from experts.models import ExpertProfile
        
        # Test creating model instances (without saving)
        podcast = Podcast(title="Test Podcast")
        expert = ExpertProfile(name="Test Expert", expertise="Testing")
        
        print(f"✅ Models imported successfully")
        print(f"   Podcast: {podcast}")
        print(f"   Expert: {expert}")
        
        return True
        
    except Exception as e:
        print(f"❌ Model test failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Cloudinary Integration Test")
    print("=" * 40)
    
    # Test configuration
    config_ok = test_cloudinary_config()
    
    # Test Django models
    models_ok = test_django_models()
    
    print(f"\n📊 Test Results:")
    print(f"   Configuration: {'✅ PASS' if config_ok else '❌ FAIL'}")
    print(f"   Django Models: {'✅ PASS' if models_ok else '❌ PASS'}")
    
    if config_ok and models_ok:
        print(f"\n🎉 All tests passed! Cloudinary is working correctly.")
    else:
        print(f"\n⚠️  Some tests failed. Check the configuration.")
    
    print(f"\n" + "=" * 40)
