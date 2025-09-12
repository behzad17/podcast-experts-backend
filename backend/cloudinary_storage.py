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
        # Upload to Cloudinary with public access
        result = cloudinary.uploader.upload(
            content,
            public_id=name,
            resource_type="image",
            overwrite=True,
            invalidate=True,
            use_filename=True,
            unique_filename=False,
            folder="expert_profiles"
        )
        
        # Return the public_id as the name
        return name
    
    def url(self, name):
        """Get the URL for a file"""
        if not name:
            return ''
        
        # Check if it's a Cloudinary URL
        if name.startswith('http'):
            return name
        
        # Check if it's a local file
        local_path = os.path.join(settings.BASE_DIR, 'media', name)
        if os.path.exists(local_path):
            # Return local URL
            return f"/media/{name}"
        
        # Try to construct Cloudinary URL via SDK
        try:
            url, _ = cloudinary_url(name, secure=True, resource_type="image")
            if url:
                return url
        except Exception:
            pass
        
        # Fallback to local URL
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
