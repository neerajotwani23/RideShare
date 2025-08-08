from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, CheckConstraint
from sqlalchemy.orm import relationship, validates
from sqlalchemy.sql import func
import re
from .base import Base

class Vehicle(Base):
    __tablename__ = "vehicle"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    name_make = Column(String(100), nullable=True)  # Brand/Make (matches database)
    model = Column(String(100), nullable=True)
    color = Column(String(50), nullable=True)
    no_plate = Column(String(20), nullable=True, unique=True)  # License plate (matches database)
    registration = Column(String(255), nullable=True, unique=True)  # Vehicle registration (matches database)
    created_at = Column(DateTime, default=func.now())
    
    # Database-level constraints
    __table_args__ = (
        CheckConstraint('length(name_make) >= 2', name='check_make_length'),
        CheckConstraint('length(model) >= 1', name='check_model_length'),
        CheckConstraint('length(color) >= 2', name='check_color_length'),
        CheckConstraint('length(no_plate) >= 5', name='check_plate_length'),
        CheckConstraint('length(registration) >= 5', name='check_registration_length'),
    )
    
    # Relationships
    owner = relationship("User", back_populates="vehicle")
    
    # Validation methods
    @validates('name_make')
    def validate_name_make(self, key, name_make):
        if name_make is None:
            return name_make
        name_make = name_make.strip()
        if not name_make:
            return None
        if len(name_make) < 2:
            raise ValueError("Vehicle make must be at least 2 characters long")
        if not re.match(r'^[a-zA-Z0-9\s\-]+$', name_make):
            raise ValueError("Vehicle make can only contain letters, numbers, spaces, and hyphens")
        return name_make.title()
    
    @validates('model')
    def validate_model(self, key, model):
        if model is None:
            return model
        model = model.strip()
        if not model:
            return None
        if len(model) < 1:
            raise ValueError("Vehicle model must be at least 1 character long")
        if not re.match(r'^[a-zA-Z0-9\s\-]+$', model):
            raise ValueError("Vehicle model can only contain letters, numbers, spaces, and hyphens")
        return model.title()
    
    @validates('color')
    def validate_color(self, key, color):
        if color is None:
            return color
        color = color.strip()
        if not color:
            return None
        if len(color) < 2:
            raise ValueError("Vehicle color must be at least 2 characters long")
        if not re.match(r'^[a-zA-Z\s]+$', color):
            raise ValueError("Vehicle color can only contain letters and spaces")
        return color.title()
    
    @validates('no_plate')
    def validate_no_plate(self, key, no_plate):
        if no_plate is None:
            return no_plate
        no_plate = no_plate.strip().upper()
        if not no_plate:
            return None
        if len(no_plate) < 5:
            raise ValueError("License plate must be at least 5 characters long")
        # Pakistani license plate format: ABC-123 or ABC-1234
        plate_pattern = r'^[A-Z]{2,3}-\d{3,4}$'
        if not re.match(plate_pattern, no_plate):
            raise ValueError("Invalid license plate format. Use format: ABC-123 or ABC-1234")
        return no_plate
    
    @validates('registration')
    def validate_registration(self, key, registration):
        if registration is None:
            return registration
        registration = registration.strip()
        if not registration:
            return None
        if len(registration) < 5:
            raise ValueError("Vehicle registration must be at least 5 characters long")
        if len(registration) > 255:
            raise ValueError("Vehicle registration cannot exceed 255 characters")
        return registration.strip() 