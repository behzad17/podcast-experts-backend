#!/usr/bin/env python
"""
Script to upload default podcast image to Cloudinary
"""

import os
import cloudinary
import cloudinary.uploader

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

def upload_podcast_default():
    """Upload default podcast image to Cloudinary"""
    print("🚀 Uploading default podcast image to Cloudinary...")
    
    # Configure Cloudinary
    cloudinary.config(
        cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
        api_key=os.getenv('CLOUDINARY_API_KEY'),
        api_secret=os.getenv('CLOUDINARY_API_SECRET')
    )
    
    try:
        # Upload the default podcast image
        result = cloudinary.uploader.upload(
            "podcast_images/default_podcast.png",
            public_id="podcast_images/default_podcast",
            resource_type="auto",
            overwrite=True
        )
        
        print(f"✅ Default podcast image uploaded successfully!")
        print(f"   Public ID: {result['public_id']}")
        print(f"   URL: {result['secure_url']}")
        
        return result['public_id']
        
    except Exception as e:
        print(f"❌ Failed to upload default podcast image: {e}")
        return None

if __name__ == "__main__":
    upload_podcast_default()
