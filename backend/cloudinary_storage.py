"""
Custom Cloudinary storage backend for Django
"""
import os
import cloudinary
import cloudinary.uploader
from django.conf import settings
from django.core.files.storage import Storage
from django.core.files.base import File
from django.utils.deconstruct import deconstructible
from urllib.parse import urlparse
from cloudinary.utils import cloudinary_url


@deconstructible
class CustomCloudinaryStorage(Storage):
    """
    Custom Cloudinary storage backend for Django
    """
    
    def __init__(self, location=None, base_url=None):
        super().__init__()
        # Configure Cloudinary
        cloudinary.config(
            cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
            api_key=os.getenv('CLOUDINARY_API_KEY'),
            api_secret=os.getenv('CLOUDINARY_API_SECRET'),
        )
        self.location = location or ''
        self.base_url = base_url or 'https://res.cloudinary.com'
    
    def _open(self, name, mode='rb'):
        """Open a file from Cloudinary"""
        # For reading, we return a file-like object
        # Since Cloudinary doesn't support direct file reading in this way,
        # we'll return a placeholder file object
        class CloudinaryFile(File):
            def __init__(self, name, storage):
                self.name = name
                self.storage = storage
                self._file = None
            
            def read(self, *args, **kwargs):
                # Return empty content for now
                return b''
            
            def close(self):
                pass
        
        return CloudinaryFile(name, self)
    
    def _save(self, name, content):
        """Save a file to Cloudinary"""
        # The 'name' parameter comes from the model's upload_to (e.g., "expert_profiles/photo.jpg")
        # Use this directly as the public_id, but ensure it doesn't have leading/trailing slashes
        public_id = name.strip('/')
        
        # Upload to Cloudinary with public access
        # Note: We use public_id directly, not folder parameter, to avoid duplication
        result = cloudinary.uploader.upload(
            content,
            public_id=public_id,
            resource_type="image",
            overwrite=True,
            invalidate=True,
            use_filename=True,
            unique_filename=True,  # Ensure unique filenames to avoid conflicts
        )
        
        # Extract the public_id and secure_url from Cloudinary's response
        stored_public_id = result.get('public_id', public_id)
        secure_url = result.get('secure_url', '')
        
        # Debug logging
        print("✅ Cloudinary upload successful:")
        print(f"   - Input name: {name}")
        print(f"   - Public ID: {stored_public_id}")
        print(f"   - Secure URL: {secure_url}")
        
        # For this project, we store the full secure_url in the DB for simplicity and reliability.
        # This ensures the URL always works without needing to reconstruct it from public_id.
        # If secure_url is not available, fall back to public_id (for legacy compatibility).
        return secure_url or stored_public_id
    
    def url(self, name):
        """Get the URL for a file"""
        if not name:
            return ''
        
        # If name is already a full URL (new uploads store secure_url), return it as-is
        if name.startswith('http://') or name.startswith('https://'):
            return name
        
        # For legacy values where name is a public_id (not a full URL),
        # construct the Cloudinary URL using the SDK
        # Do NOT force version "v1" - let Cloudinary use the actual version
        try:
            url, _ = cloudinary_url(name, secure=True, resource_type="image")
            if url:
                print(f"✅ Generated Cloudinary URL: {url} from public_id: {name}")
                return url
        except Exception as e:
            print(f"⚠️ Error generating Cloudinary URL for {name}: {e}")
        
        # Check if it's a local file (fallback)
        local_path = os.path.join(settings.BASE_DIR, 'media', name)
        if os.path.exists(local_path):
            # Return local URL
            return f"/media/{name}"
        
        # Final fallback
        print(f"⚠️ Could not generate URL for {name}, using fallback")
        return f"/media/{name}"
    
    def exists(self, name):
        """Check if a file exists"""
        if not name:
            return False
        
        # Check Cloudinary
        try:
            cloudinary.api.resource(name)
            return True
        except:
            return False
    
    def size(self, name):
        """Get file size"""
        if not name:
            return 0
        
        # For Cloudinary files, we can't easily get size without API call
        return 0
    
    def delete(self, name):
        """Delete a file"""
        if not name:
            return
        
        # Delete from Cloudinary
        try:
            cloudinary.uploader.destroy(name)
        except:
            pass
    
    def get_accessed_time(self, name):
        """Get last accessed time"""
        return None
    
    def get_created_time(self, name):
        """Get creation time"""
        return None
    
    def get_modified_time(self, name):
        """Get last modified time"""
        return None
