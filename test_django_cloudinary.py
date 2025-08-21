#!/usr/bin/env python3
"""
Test Django Cloudinary storage configuration
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

def test_django_cloudinary():
    print("🔍 Testing Django Cloudinary Storage...")
    
    try:
        from django.conf import settings
        from cloudinary_storage.storage import MediaCloudinaryStorage
        
        print(f"✅ Django settings loaded")
        print(f"✅ Cloudinary storage imported")
        
        # Check settings
        print(f"\n📋 Cloudinary Settings:")
        print(f"CLOUDINARY_STORAGE: {settings.CLOUDINARY_STORAGE}")
        print(f"DEFAULT_FILE_STORAGE: {settings.DEFAULT_FILE_STORAGE}")
        
        # Test storage class
        storage = MediaCloudinaryStorage()
        print(f"✅ Storage class created: {storage}")
        
        # Test configuration
        cloud_name = settings.CLOUDINARY_STORAGE.get('CLOUD_NAME')
        api_key = settings.CLOUDINARY_STORAGE.get('API_KEY')
        api_secret = settings.CLOUDINARY_STORAGE.get('API_SECRET')
        
        print(f"\n🔑 Storage Configuration:")
        print(f"Cloud Name: {cloud_name}")
        print(f"API Key: {api_key}")
        print(f"API Secret: {'*' * len(api_secret) if api_secret else 'NOT SET'}")
        
        # Test if we can access the storage methods
        print(f"\n🔧 Testing Storage Methods:")
        print(f"Storage class: {type(storage)}")
        print(f"Has _save method: {hasattr(storage, '_save')}")
        print(f"Has url method: {hasattr(storage, 'url')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Django Cloudinary test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🚀 Django Cloudinary Storage Test")
    print("=" * 40)
    
    success = test_django_cloudinary()
    
    if success:
        print("\n🎉 Django Cloudinary storage is configured correctly!")
    else:
        print("\n⚠️  Django Cloudinary storage test failed!")
    
    print("=" * 40)
