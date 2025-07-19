from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class Vehicle(Base):
    __tablename__ = "vehicle"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    name_make = Column(String(100), nullable=True)  # Brand/Make (matches database)
    model = Column(String(100), nullable=True)
    color = Column(String(50), nullable=True)
    no_plate = Column(String(20), nullable=True)  # License plate (matches database)
    registration = Column(String(255), nullable=True)  # Vehicle registration (matches database)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="vehicle") 