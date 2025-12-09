#!/usr/bin/env python3
"""
Test file upload through Django Cloudinary storage
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


def test_file_upload():
    print("🔍 Testing File Upload through Django Cloudinary...")
    
    try:
        from django.core.files.base import ContentFile
        from django.core.files.storage import default_storage
        
        print("✅ Django storage imported")
        print(f"Default storage: {default_storage}")
        
        # Create a test file content
        test_content = b"This is a test file for Cloudinary upload"
        test_filename = "test_upload.txt"
        
        print("\n📤 Testing file upload...")
        print(f"File name: {test_filename}")
        print(f"Content length: {len(test_content)} bytes")
        
        # Upload the file
        file_path = default_storage.save(test_filename, ContentFile(test_content))
        print("✅ File uploaded successfully!")
        print(f"Stored path: {file_path}")
        
        # Get the URL
        file_url = default_storage.url(file_path)
        print(f"File URL: {file_url}")
        
        # Check if file exists
        file_exists = default_storage.exists(file_path)
        print(f"File exists: {file_exists}")
        
        # Get file size
        file_size = default_storage.size(file_path)
        print(f"File size: {file_size} bytes")
        
        # Clean up - delete the file
        print("\n🧹 Cleaning up test file...")
        default_storage.delete(file_path)
        print("✅ Test file deleted")
        
        return True
        
    except Exception as e:
        print(f"❌ File upload test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("🚀 Django File Upload Test")
    print("=" * 40)
    
    success = test_file_upload()
    
    if success:
        print("\n🎉 File upload through Django Cloudinary is working!")
    else:
        print("\n⚠️  File upload test failed!")
    
    print("=" * 40)
