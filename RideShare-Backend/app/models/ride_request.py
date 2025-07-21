from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum, CheckConstraint
from sqlalchemy.orm import relationship, validates
from sqlalchemy.sql import func
import enum
import re
from .base import Base
from .ride import GenderPreferenceEnum

class RideRequestStatusEnum(enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    CANCELLED = "cancelled"

class RideRequest(Base):
    __tablename__ = "riderequest"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)  # Passenger
    ride_id = Column(Integer, ForeignKey("ride.id"), nullable=False)
    datetime = Column(DateTime, default=func.now())
    status = Column(SQLEnum(RideRequestStatusEnum), nullable=False, default=RideRequestStatusEnum.PENDING)
    seats = Column(Integer, nullable=False)
    # Optional fields for custom requests
    source = Column(String(255), nullable=True)
    destination = Column(String(255), nullable=True)
    ac = Column(Boolean, default=False)
    smoking = Column(Boolean, default=False)
    music = Column(Boolean, default=False)
    gender_preference = Column(SQLEnum(GenderPreferenceEnum), default=GenderPreferenceEnum.ANY)
    
    # Database-level constraints
    __table_args__ = (
        CheckConstraint('seats > 0 AND seats <= 10', name='check_seats_range'),
        CheckConstraint('length(source) >= 3 OR source IS NULL', name='check_source_length'),
        CheckConstraint('length(destination) >= 3 OR destination IS NULL', name='check_destination_length'),
    )
    
    # Relationships
    passenger = relationship("User", back_populates="riderequest")
    ride = relationship("Ride", back_populates="riderequest")
    
    # Validation methods
    @validates('seats')
    def validate_seats(self, key, seats):
        if seats <= 0:
            raise ValueError("Number of seats must be greater than 0")
        if seats > 10:
            raise ValueError("Number of seats cannot exceed 10")
        return seats
    
    @validates('source')
    def validate_source(self, key, source):
        if source is None:
            return source
        source = source.strip()
        if not source:
            return None
        if len(source) < 3:
            raise ValueError("Source location must be at least 3 characters long")
        if not re.match(r'^[a-zA-Z0-9\s\-,\.]+$', source):
            raise ValueError("Source location can only contain letters, numbers, spaces, commas, hyphens, and periods")
        return source.strip().title()
    
    @validates('destination')
    def validate_destination(self, key, destination):
        if destination is None:
            return destination
        destination = destination.strip()
        if not destination:
            return None
        if len(destination) < 3:
            raise ValueError("Destination location must be at least 3 characters long")
        if not re.match(r'^[a-zA-Z0-9\s\-,\.]+$', destination):
            raise ValueError("Destination location can only contain letters, numbers, spaces, commas, hyphens, and periods")
        return destination.strip().title()
    
    @validates('status')
    def validate_status(self, key, status):
        if status not in RideRequestStatusEnum:
            raise ValueError("Invalid ride request status")
        return status
    
    @validates('gender_preference')
    def validate_gender_preference(self, key, gender_preference):
        if gender_preference not in GenderPreferenceEnum:
            raise ValueError("Invalid gender preference")
        return gender_preference 