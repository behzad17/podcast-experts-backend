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
        try:
            # Upload to Cloudinary
            result = cloudinary.uploader.upload(
                content,
                public_id=name,
                resource_type="auto",
                overwrite=True
            )
            
            # Return the public_id as the name
            return name
            
        except Exception as e:
            # If Cloudinary upload fails, fall back to local storage
            print(f"Cloudinary upload failed for {name}: {e}")
            # Create local directory if it doesn't exist
            local_path = os.path.join(settings.BASE_DIR, 'media', name)
            os.makedirs(os.path.dirname(local_path), exist_ok=True)
            
            # Save locally as fallback
            with open(local_path, 'wb') as f:
                for chunk in content.chunks():
                    f.write(chunk)
            
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
        
        # Check local file first
        local_path = os.path.join(settings.BASE_DIR, 'media', name)
        if os.path.exists(local_path):
            return True
        
        # Check Cloudinary (this is a simplified check)
        try:
            cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
            if cloud_name:
                # Try to get file info from Cloudinary
                result = cloudinary.api.resource(f"{name}")
                return True
        except:
            pass
        
        return False
    
    def size(self, name):
        """Get file size"""
        if not name:
            return 0
        
        # Check local file first
        local_path = os.path.join(settings.BASE_DIR, 'media', name)
        if os.path.exists(local_path):
            return os.path.getsize(local_path)
        
        # For Cloudinary files, we can't easily get size without API call
        return 0
    
    def delete(self, name):
        """Delete a file"""
        if not name:
            return
        
        # Delete local file if it exists
        local_path = os.path.join(settings.BASE_DIR, 'media', name)
        if os.path.exists(local_path):
            os.remove(local_path)
        
        # Try to delete from Cloudinary
        try:
            cloudinary.uploader.destroy(name)
        except:
            pass
    
    def get_accessed_time(self, name):
        """Get last accessed time"""
        local_path = os.path.join(settings.BASE_DIR, 'media', name)
        if os.path.exists(local_path):
            return os.path.getatime(local_path)
        return None
    
    def get_created_time(self, name):
        """Get creation time"""
        local_path = os.path.join(settings.BASE_DIR, 'media', name)
        if os.path.exists(local_path):
            return os.path.getctime(local_path)
        return None
    
    def get_modified_time(self, name):
        """Get last modified time"""
        local_path = os.path.join(settings.BASE_DIR, 'media', name)
        if os.path.exists(local_path):
            return os.path.getmtime(local_path)
        return None
