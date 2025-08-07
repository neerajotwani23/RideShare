from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional
import uuid
from datetime import datetime

from ..database import SessionLocal
import os
from pathlib import Path
from ..controllers.auth_controller import AuthController
from ..models.user import User
from ..models.vehicle import Vehicle
from .. import schemas
from ..core.cloudinary_config import cloudinary_service

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class FileUploadController:
    def __init__(self):
        self.router = APIRouter(prefix="/upload", tags=["File Upload"])
        self._setup_routes()
    
    def _setup_routes(self):
        # Profile picture upload
        self.router.add_api_route("/profile-picture", self.upload_profile_picture, methods=["POST"])
        
        # Vehicle document uploads
        self.router.add_api_route("/driving-license", self.upload_driving_license, methods=["POST"])
        self.router.add_api_route("/vehicle-registration", self.upload_vehicle_registration, methods=["POST"])
        
        # File management
        self.router.add_api_route("/delete/{file_id}", self.delete_file, methods=["DELETE"])
    
    async def upload_profile_picture(
        self,
        file: UploadFile = File(...),
        current_user: User = Depends(AuthController.get_current_user),
        db: Session = Depends(get_db)
    ):
        """Upload user profile picture"""
        try:
            # Validate file type
            if not file.content_type.startswith('image/'):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Only image files are allowed for profile pictures"
                )
            
            # Validate file size (max 5MB)
            file_content = await file.read()
            if len(file_content) > 5 * 1024 * 1024:  # 5MB
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="File size must be less than 5MB"
                )
            
            # Generate unique filename
            file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
            filename = f"profile_pictures/{current_user.id}_{uuid.uuid4()}.{file_extension}"
            
            # Debug logging
            print(f"=== PROFILE PICTURE UPLOAD DEBUG ===")
            print(f"User ID: {current_user.id}")
            print(f"Filename: {filename}")
            print(f"File size: {len(file_content)} bytes")
            print(f"Content type: {file.content_type}")
            
            # Upload to Cloudinary
            file_url = cloudinary_service.upload_file(
                file_content, 
                filename, 
                "profile_pictures"
            )
            
            if not file_url:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to upload file to Cloudinary"
                )
            
            # Get the user from the current database session to avoid session issues
            user = db.query(User).filter(User.id == current_user.id).first()
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            
            # Update user profile in database
            user.profile_picture = file_url
            db.commit()
            db.refresh(user)
            
            return {
                "message": "Profile picture uploaded successfully",
                "file_url": file_url,
                "filename": filename
            }
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload profile picture: {str(e)}"
            )
    
    async def upload_driving_license(
        self,
        file: UploadFile = File(...),
        current_user: User = Depends(AuthController.get_current_user),
        db: Session = Depends(get_db)
    ):
        """Upload driving license document"""
        try:
            # Validate file type (images and PDFs)
            allowed_types = ['image/', 'application/pdf']
            if not any(file.content_type.startswith(t) for t in allowed_types):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Only image and PDF files are allowed for driving license"
                )
            
            # Validate file size (max 10MB)
            file_content = await file.read()
            if len(file_content) > 10 * 1024 * 1024:  # 10MB
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="File size must be less than 10MB"
                )
            
            # Generate unique filename
            file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'pdf'
            filename = f"{current_user.id}_{uuid.uuid4()}.{file_extension}"
            
            # Upload to Cloudinary
            file_url = cloudinary_service.upload_file(
                file_content, 
                filename, 
                "driving_licenses"
            )
            
            if not file_url:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to upload file to Cloudinary"
                )
            
            # Get the user from the current database session to avoid session issues
            user = db.query(User).filter(User.id == current_user.id).first()
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            
            # Update user driving license in database
            user.driving_license = file_url
            db.commit()
            db.refresh(user)
            
            return {
                "message": "Driving license uploaded successfully",
                "file_url": file_url,
                "filename": filename
            }
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload driving license: {str(e)}"
            )
    
    async def upload_vehicle_registration(
        self,
        file: UploadFile = File(...),
        current_user: User = Depends(AuthController.get_current_user),
        db: Session = Depends(get_db)
    ):
        """Upload vehicle registration document"""
        try:
            # Validate file type (images and PDFs)
            allowed_types = ['image/', 'application/pdf']
            if not any(file.content_type.startswith(t) for t in allowed_types):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Only image and PDF files are allowed for vehicle registration"
                )
            
            # Validate file size (max 10MB)
            file_content = await file.read()
            if len(file_content) > 10 * 1024 * 1024:  # 10MB
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="File size must be less than 10MB"
                )
            
            # Generate unique filename
            file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'pdf'
            filename = f"{current_user.id}_{uuid.uuid4()}.{file_extension}"
            
            # Upload to Cloudinary
            file_url = cloudinary_service.upload_file(
                file_content, 
                filename, 
                "vehicle_registrations"
            )
            
            if not file_url:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to upload file to Cloudinary"
                )
            
            # Find user's vehicle and update registration
            vehicle = db.query(Vehicle).filter(Vehicle.user_id == current_user.id).first()
            
            if vehicle:
                vehicle.registration = file_url
                db.commit()
                db.refresh(vehicle)
            else:
                # Create new vehicle record if none exists
                vehicle = Vehicle(
                    user_id=current_user.id,
                    registration=file_url
                )
                db.add(vehicle)
                db.commit()
                db.refresh(vehicle)
            
            return {
                "message": "Vehicle registration uploaded successfully",
                "file_url": file_url,
                "filename": filename,
                "vehicle_id": vehicle.id
            }
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload vehicle registration: {str(e)}"
            )
    
    async def delete_file(
        self,
        public_id: str,
        current_user: User = Depends(AuthController.get_current_user)
    ):
        """Delete a file from Cloudinary"""
        try:
            success = cloudinary_service.delete_file(public_id)
            
            if not success:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to delete file from Cloudinary"
                )
            
            return {"message": "File deleted successfully"}
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete file from Cloudinary: {str(e)}"
            )

# Create router instance
file_upload_controller = FileUploadController() 