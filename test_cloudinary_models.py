#!/usr/bin/env python3
"""
Test Cloudinary integration in Django models
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

def test_cloudinary_in_models():
    print("🔍 Testing Cloudinary Integration in Models...")
    
    try:
        from podcasts.models import Podcast
        from experts.models import ExpertProfile
        
        print("✅ Models imported successfully")
        
        # Test Cloudinary configuration
        import cloudinary
        cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
        api_key = os.getenv('CLOUDINARY_API_KEY')
        api_secret = os.getenv('CLOUDINARY_API_SECRET')
        
        print(f"Cloudinary Config:")
        print(f"  Cloud Name: {cloud_name}")
        print(f"  API Key: {api_key}")
        print(f"  API Secret: {'*' * len(api_secret) if api_secret else 'NOT SET'}")
        
        # Test if Cloudinary is configured
        if all([cloud_name, api_key, api_secret]):
            print("✅ Cloudinary credentials loaded")
            
            # Test Cloudinary connection
            try:
                cloudinary.config(
                    cloud_name=cloud_name,
                    api_key=api_key,
                    api_secret=api_secret
                )
                print("✅ Cloudinary configured successfully")
                
                # Test a simple upload
                print("\n📤 Testing Cloudinary upload...")
                test_content = b"This is a test file for Cloudinary"
                
                result = cloudinary.uploader.upload(
                    test_content,
                    resource_type="auto",
                    folder="test_uploads"
                )
                
                print(f"✅ Test upload successful!")
                print(f"   URL: {result['url']}")
                print(f"   Public ID: {result['public_id']}")
                
                # Clean up test upload
                cloudinary.uploader.destroy(result['public_id'])
                print("✅ Test upload cleaned up")
                
                return True
                
            except Exception as e:
                print(f"❌ Cloudinary test failed: {e}")
                return False
        else:
            print("❌ Missing Cloudinary credentials")
            return False
            
    except Exception as e:
        print(f"❌ Model test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🚀 Cloudinary Models Integration Test")
    print("=" * 50)
    
    success = test_cloudinary_in_models()
    
    if success:
        print("\n🎉 Cloudinary integration in models is working!")
    else:
        print("\n⚠️  Cloudinary integration test failed!")
    
    print("=" * 50)
