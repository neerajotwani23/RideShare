import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from googleapiclient.errors import HttpError
import io
import mimetypes
from typing import Optional, Tuple
import logging

logger = logging.getLogger(__name__)

class GoogleDriveService:
    def __init__(self):
        self.service = None
        self.folder_id = os.getenv('GOOGLE_DRIVE_FOLDER_ID')
        self._initialize_service()
    
    def _initialize_service(self):
        """Initialize Google Drive service with service account credentials"""
        try:
            # Service account credentials (you'll need to create this)
            credentials_path = os.getenv('GOOGLE_DRIVE_CREDENTIALS_PATH', 'credentials.json')
            logger.info(f"Looking for Google Drive credentials at: {credentials_path}")
            logger.info(f"Current working directory: {os.getcwd()}")
            
            if os.path.exists(credentials_path):
                logger.info(f"Credentials file found at: {credentials_path}")
                credentials = service_account.Credentials.from_service_account_file(
                    credentials_path,
                    scopes=['https://www.googleapis.com/auth/drive.file']
                )
                self.service = build('drive', 'v3', credentials=credentials)
                logger.info("Google Drive service initialized successfully")
                logger.info(f"Google Drive folder ID: {self.folder_id}")
            else:
                logger.warning(f"Google Drive credentials not found at: {credentials_path}")
                logger.warning("File uploads will be disabled.")
                self.service = None
        except Exception as e:
            logger.error(f"Failed to initialize Google Drive service: {e}")
            logger.error(f"Exception type: {type(e).__name__}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            self.service = None
    
    def upload_file(self, file_data: bytes, filename: str, mime_type: Optional[str] = None) -> Optional[str]:
        """
        Upload a file to Google Drive and return the file ID
        
        Args:
            file_data: File content as bytes
            filename: Name of the file
            mime_type: MIME type of the file (auto-detected if not provided)
        
        Returns:
            File ID if successful, None otherwise
        """
        if not self.service:
            logger.error("Google Drive service not available")
            return None
        
        try:
            # Auto-detect MIME type if not provided
            if not mime_type:
                mime_type, _ = mimetypes.guess_type(filename)
                if not mime_type:
                    mime_type = 'application/octet-stream'
            
            # Create file metadata
            file_metadata = {
                'name': filename,
                'parents': [self.folder_id] if self.folder_id else []
            }
            
            # Create media upload
            media = MediaIoBaseUpload(
                io.BytesIO(file_data),
                mimetype=mime_type,
                resumable=True
            )
            
            # Upload file
            file = self.service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id,webViewLink'
            ).execute()
            
            logger.info(f"File uploaded successfully: {file.get('id')}")
            return file.get('id')
            
        except HttpError as error:
            logger.error(f"Google Drive upload error: {error}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error during file upload: {e}")
            return None
    
    def get_file_url(self, file_id: str) -> Optional[str]:
        """
        Get a publicly accessible URL for a file
        
        Args:
            file_id: Google Drive file ID
        
        Returns:
            Public URL if successful, None otherwise
        """
        if not self.service:
            return None
        
        try:
            # Make file publicly accessible
            self.service.permissions().create(
                fileId=file_id,
                body={'type': 'anyone', 'role': 'reader'},
                fields='id'
            ).execute()
            
            # Return the web view link
            file = self.service.files().get(
                fileId=file_id,
                fields='webViewLink'
            ).execute()
            
            return file.get('webViewLink')
            
        except HttpError as error:
            logger.error(f"Error getting file URL: {error}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error getting file URL: {e}")
            return None
    
    def delete_file(self, file_id: str) -> bool:
        """
        Delete a file from Google Drive
        
        Args:
            file_id: Google Drive file ID
        
        Returns:
            True if successful, False otherwise
        """
        if not self.service:
            return False
        
        try:
            self.service.files().delete(fileId=file_id).execute()
            logger.info(f"File deleted successfully: {file_id}")
            return True
            
        except HttpError as error:
            logger.error(f"Error deleting file: {error}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error deleting file: {e}")
            return False
    
    def update_file(self, file_id: str, file_data: bytes, mime_type: Optional[str] = None) -> bool:
        """
        Update an existing file in Google Drive
        
        Args:
            file_id: Google Drive file ID
            file_data: New file content as bytes
            mime_type: MIME type of the file
        
        Returns:
            True if successful, False otherwise
        """
        if not self.service:
            return False
        
        try:
            # Auto-detect MIME type if not provided
            if not mime_type:
                mime_type = 'application/octet-stream'
            
            # Create media upload
            media = MediaIoBaseUpload(
                io.BytesIO(file_data),
                mimetype=mime_type,
                resumable=True
            )
            
            # Update file
            self.service.files().update(
                fileId=file_id,
                media_body=media
            ).execute()
            
            logger.info(f"File updated successfully: {file_id}")
            return True
            
        except HttpError as error:
            logger.error(f"Error updating file: {error}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error updating file: {e}")
            return False

# Global instance
google_drive_service = GoogleDriveService() 