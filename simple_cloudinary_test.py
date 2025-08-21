#!/usr/bin/env python3
"""
Simple Cloudinary test without Django
"""
import os

# Load environment variables
from dotenv import load_dotenv
load_dotenv()


def test_cloudinary():
    print("🔍 Testing Cloudinary Configuration...")
    
    # Get credentials
    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
    api_key = os.getenv('CLOUDINARY_API_KEY')
    api_secret = os.getenv('CLOUDINARY_API_SECRET')
    
    print(f"Cloud Name: {cloud_name}")
    print(f"API Key: {api_key}")
    print(f"API Secret: {'*' * len(api_secret) if api_secret else 'NOT SET'}")
    
    if not all([cloud_name, api_key, api_secret]):
        print("❌ Missing credentials!")
        return False
    
    try:
        # Import and configure Cloudinary
        import cloudinary
        cloudinary.config(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret
        )
        
        print("✅ Cloudinary configured successfully")
        
        # Test basic functionality
        import cloudinary.uploader
        
        # Create a simple test file
        test_file = "test.txt"
        with open(test_file, 'w') as f:
            f.write("test content")
        
        try:
            # Try to upload
            result = cloudinary.uploader.upload(
                test_file,
                resource_type="auto",
                folder="test"
            )
            print(f"✅ Upload successful: {result['url']}")
            
            # Clean up
            os.remove(test_file)
            cloudinary.uploader.destroy(result['public_id'])
            print("✅ Test file cleaned up")
            
            return True
            
        except Exception as e:
            print(f"❌ Upload failed: {e}")
            if os.path.exists(test_file):
                os.remove(test_file)
            return False
            
    except Exception as e:
        print(f"❌ Configuration failed: {e}")
        return False


if __name__ == "__main__":
    print("🚀 Simple Cloudinary Test")
    print("=" * 30)
    
    success = test_cloudinary()
    
    if success:
        print("\n🎉 Cloudinary is working!")
    else:
        print("\n⚠️  Cloudinary test failed!")
    
    print("=" * 30)
