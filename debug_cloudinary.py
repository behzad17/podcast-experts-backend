#!/usr/bin/env python3
"""
Debug Cloudinary configuration issues
"""
import os
from dotenv import load_dotenv
load_dotenv()


def debug_cloudinary():
    print("🔍 Debugging Cloudinary Configuration...")
    
    # Get credentials
    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
    api_key = os.getenv('CLOUDINARY_API_KEY')
    api_secret = os.getenv('CLOUDINARY_API_SECRET')
    
    print(f"Cloud Name: '{cloud_name}' (length: {len(cloud_name) if cloud_name else 0})")
    print(f"API Key: '{api_key}' (length: {len(api_key) if api_key else 0})")
    secret_display = '*' * len(api_secret) if api_secret else 'NOT SET'
    secret_length = len(api_secret) if api_secret else 0
    print(f"API Secret: '{secret_display}' (length: {secret_length})")
    
    # Check for common issues
    if cloud_name:
        if len(cloud_name) < 3:
            print("⚠️  Cloud name seems too short (usually 3+ characters)")
        if not cloud_name.isalnum():
            print("⚠️  Cloud name contains non-alphanumeric characters")
        if cloud_name.isupper() and len(cloud_name) <= 3:
            print("⚠️  Cloud name might be an abbreviation that needs expansion")
    
    if api_key:
        if not api_key.isdigit():
            print("⚠️  API key should be numeric")
        if len(api_key) < 10:
            print("⚠️  API key seems too short")
    
    if api_secret:
        if len(api_secret) < 20:
            print("⚠️  API secret seems too short")
    
    # Try to construct Cloudinary URL
    if cloud_name:
        test_url = f"https://res.cloudinary.com/{cloud_name}/image/upload/v1/test"
        print(f"\n🔗 Test Cloudinary URL: {test_url}")
        
        # Try to access it
        import requests
        try:
            response = requests.get(test_url, timeout=5)
            print(f"URL Response: {response.status_code}")
            if response.status_code == 404:
                print("✅ URL is accessible (404 is expected for non-existent image)")
            elif response.status_code == 403:
                print("❌ Access forbidden - cloud name might be incorrect")
            else:
                print(f"Unexpected response: {response.status_code}")
        except Exception as e:
            print(f"URL test error: {e}")
    
    # Try different cloud name variations
    print("\n🔄 Testing cloud name variations...")
    variations = [
        cloud_name,
        cloud_name.lower() if cloud_name else None,
        cloud_name.upper() if cloud_name else None,
        f"{cloud_name}cloud" if cloud_name else None,
        f"cloud{cloud_name}" if cloud_name else None,
    ]
    
    for var in variations:
        if var:
            test_url = f"https://res.cloudinary.com/{var}/image/upload/v1/test"
            print(f"Testing: {var} -> {test_url}")


if __name__ == "__main__":
    print("🚀 Cloudinary Debug Tool")
    print("=" * 40)
    
    debug_cloudinary()
    
    print("\n" + "=" * 40)
    print("💡 Suggestions:")
    print("1. Check your Cloudinary dashboard for the exact cloud name")
    print("2. Cloud names are usually lowercase and 3+ characters")
    print("3. Try logging into cloudinary.com with your credentials")
    print("4. Verify the cloud name in your Cloudinary dashboard")
