from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum as SQLEnum, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
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
    
    # Relationships
    driver = relationship("User", back_populates="rides_offered")
    riderequest = relationship("RideRequest", back_populates="ride", cascade="all, delete-orphan")
    transaction = relationship("Transaction", back_populates="ride", cascade="all, delete-orphan") 