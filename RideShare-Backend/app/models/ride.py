from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum as SQLEnum, Numeric, CheckConstraint
from sqlalchemy.orm import relationship, validates
from sqlalchemy.sql import func
import enum
import re
from datetime import datetime, timedelta
from .base import Base

class RideStatusEnum(enum.Enum):
    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    CONFIRMED = "CONFIRMED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class GenderPreferenceEnum(enum.Enum):
    ANY = "ANY"
    MALE = "MALE"
    FEMALE = "FEMALE"

class Ride(Base):
    __tablename__ = "ride"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)  # Driver
    timing = Column(DateTime, nullable=False)
    status = Column(SQLEnum(RideStatusEnum), nullable=False, default=RideStatusEnum.PENDING)
    source = Column(String(255), nullable=False)
    destination = Column(String(255), nullable=False)
    fare = Column(Numeric(10, 2), nullable=False)
    seats_offered = Column(Integer, nullable=False)
    ac = Column(Boolean, default=False)
    smoking = Column(Boolean, default=False)
    music = Column(Boolean, default=False)
    gender_preference = Column(SQLEnum(GenderPreferenceEnum), default=GenderPreferenceEnum.ANY)
    created_at = Column(DateTime, default=func.now())
    
    # Database-level constraints
    __table_args__ = (
        CheckConstraint('length(source) >= 3', name='check_source_length'),
        CheckConstraint('length(destination) >= 3', name='check_destination_length'),
        CheckConstraint('fare > 0', name='check_fare_positive'),
        CheckConstraint('seats_offered > 0 AND seats_offered <= 10', name='check_seats_range'),
        CheckConstraint('source != destination', name='check_source_different_destination'),
    )
    
    # Relationships
    driver = relationship("User", back_populates="rides_offered")
    riderequest = relationship("RideRequest", back_populates="ride", cascade="all, delete-orphan")
    transaction = relationship("Transaction", back_populates="ride", cascade="all, delete-orphan")
    
    # Validation methods
    @validates('timing')
    def validate_timing(self, key, timing):
        if timing is None:
            raise ValueError("Ride timing is required")
        
        # Ensure timing is in the future (at least 30 minutes from now)
        min_timing = datetime.now() + timedelta(minutes=30)
        if timing < min_timing:
            raise ValueError("Ride timing must be at least 30 minutes in the future")
        
        # Ensure timing is not more than 30 days in the future
        max_timing = datetime.now() + timedelta(days=30)
        if timing > max_timing:
            raise ValueError("Ride timing cannot be more than 30 days in the future")
        
        return timing
    
    @validates('source')
    def validate_source(self, key, source):
        if not source or len(source.strip()) < 3:
            raise ValueError("Source location must be at least 3 characters long")
        if not re.match(r'^[a-zA-Z0-9\s\-,\.]+$', source):
            raise ValueError("Source location can only contain letters, numbers, spaces, commas, hyphens, and periods")
        return source.strip().title()
    
    @validates('destination')
    def validate_destination(self, key, destination):
        if not destination or len(destination.strip()) < 3:
            raise ValueError("Destination location must be at least 3 characters long")
        if not re.match(r'^[a-zA-Z0-9\s\-,\.]+$', destination):
            raise ValueError("Destination location can only contain letters, numbers, spaces, commas, hyphens, and periods")
        return destination.strip().title()
    
    @validates('fare')
    def validate_fare(self, key, fare):
        if fare <= 0:
            raise ValueError("Fare must be greater than 0")
        if fare > 10000:
            raise ValueError("Fare cannot exceed 10,000")
        return round(fare, 2)
    
    @validates('seats_offered')
    def validate_seats_offered(self, key, seats_offered):
        if seats_offered <= 0:
            raise ValueError("Seats offered must be greater than 0")
        if seats_offered > 10:
            raise ValueError("Seats offered cannot exceed 10")
        return seats_offered
    
    @validates('status')
    def validate_status(self, key, status):
        if status not in RideStatusEnum:
            raise ValueError("Invalid ride status")
        return status
    
    @validates('gender_preference')
    def validate_gender_preference(self, key, gender_preference):
        if gender_preference not in GenderPreferenceEnum:
            raise ValueError("Invalid gender preference")
        return gender_preference 