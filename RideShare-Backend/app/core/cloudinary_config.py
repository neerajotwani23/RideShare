import os
import cloudinary
import cloudinary.uploader
import cloudinary.api
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class CloudinaryService:
    def __init__(self):
        self._initialize_cloudinary()
    
    def _initialize_cloudinary(self):
        """Initialize Cloudinary configuration"""
        try:
            cloudinary.config(
                cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
                api_key=os.getenv('CLOUDINARY_API_KEY'),
                api_secret=os.getenv('CLOUDINARY_API_SECRET')
            )
            logger.info("Cloudinary service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Cloudinary service: {e}")
            logger.error(f"Exception type: {type(e).__name__}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
    
    def upload_file(self, file_data: bytes, filename: str, folder: str = "rideshare") -> Optional[str]:
        """
        Upload a file to Cloudinary and return the public URL
        
        Args:
            file_data: File content as bytes
            filename: Name of the file
            folder: Folder name in Cloudinary (default: "rideshare")
        
        Returns:
            Public URL if successful, None otherwise
        """
        try:
            # Upload to Cloudinary
            result = cloudinary.uploader.upload(
                file_data,
                public_id=f"{folder}/{filename}",
                resource_type="auto"
            )
            
            logger.info(f"File uploaded successfully: {result.get('public_id')}")
            return result.get('secure_url')  # Return HTTPS URL
            
        except Exception as e:
            logger.error(f"Cloudinary upload error: {e}")
            return None
    
    def delete_file(self, public_id: str) -> bool:
        """
        Delete a file from Cloudinary
        
        Args:
            public_id: Cloudinary public ID of the file
        
        Returns:
            True if successful, False otherwise
        """
        try:
            result = cloudinary.uploader.destroy(public_id)
            logger.info(f"File deleted successfully: {public_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting file: {e}")
            return False
    
    def update_file(self, public_id: str, file_data: bytes) -> bool:
        """
        Update an existing file in Cloudinary
        
        Args:
            public_id: Cloudinary public ID of the file
            file_data: New file content as bytes
        
        Returns:
            True if successful, False otherwise
        """
        try:
            # For Cloudinary, we need to delete and re-upload
            self.delete_file(public_id)
            result = cloudinary.uploader.upload(
                file_data,
                public_id=public_id,
                resource_type="auto"
            )
            logger.info(f"File updated successfully: {public_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating file: {e}")
            return False

# Global instance
cloudinary_service = CloudinaryService() 