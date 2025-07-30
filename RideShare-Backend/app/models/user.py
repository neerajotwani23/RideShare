from sqlalchemy import Column, Integer, String, Float, Text, DateTime, Enum as SQLEnum, Numeric, CheckConstraint
from sqlalchemy.orm import relationship, validates
from sqlalchemy.sql import func
import enum
import re
from .base import Base

class UserTypeEnum(enum.Enum):
    DRIVER = "DRIVER"
    PASSENGER = "PASSENGER"

class GenderEnum(enum.Enum):
    MALE = "male"
    FEMALE = "female"

class User(Base):
    __tablename__ = "user"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=True)  # Can be null for Google users
    phone_no = Column(String(20), nullable=True)
    google_id = Column(String(255), nullable=True, unique=True, index=True)
    auth_provider = Column(String(50), default="email", nullable=False)  # "email", "google", or "both"
    user_type = Column(SQLEnum(UserTypeEnum), nullable=False)
    cnic = Column(String(20), nullable=True, unique=True)
    profile_picture = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    wallet = Column(Numeric(10, 2), default=0.00)
    driving_license = Column(String(100), nullable=True)
    gender = Column(SQLEnum(GenderEnum), nullable=False)
    average_rating = Column(Float, default=5.0, nullable=False)
    created_at = Column(DateTime, default=func.now())
    
    # Database-level constraints
    __table_args__ = (
        CheckConstraint('length(first_name) >= 2', name='check_first_name_length'),
        CheckConstraint('length(last_name) >= 2', name='check_last_name_length'),
        CheckConstraint('length(email) >= 5', name='check_email_length'),
        CheckConstraint('length(password) >= 6', name='check_password_length'),
        CheckConstraint('wallet >= 0', name='check_wallet_positive'),
        CheckConstraint('average_rating >= 0 AND average_rating <= 5', name='check_rating_range'),
        CheckConstraint('length(bio) <= 1000', name='check_bio_length'),
        CheckConstraint('length(profile_picture) <= 500', name='check_profile_picture_length'),
        CheckConstraint('length(driving_license) <= 100', name='check_driving_license_length'),
    )
    
    # Relationships
    vehicle = relationship("Vehicle", back_populates="owner", cascade="all, delete-orphan")
    rides_offered = relationship("Ride", back_populates="driver", cascade="all, delete-orphan")
    riderequest = relationship("RideRequest", back_populates="passenger", cascade="all, delete-orphan")
    transaction = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    reviews_given = relationship("RatingsReviews", foreign_keys="RatingsReviews.reviewer_id", back_populates="reviewer", cascade="all, delete-orphan")
    reviews_received = relationship("RatingsReviews", foreign_keys="RatingsReviews.reviewee_id", back_populates="reviewee", cascade="all, delete-orphan")
    payments_sent = relationship("Payment", foreign_keys="Payment.from_user_id", back_populates="sender")
    payments_received = relationship("Payment", foreign_keys="Payment.to_user_id", back_populates="receiver") 
    
    # Validation methods
    @validates('first_name')
    def validate_first_name(self, key, first_name):
        if not first_name or len(first_name.strip()) < 2:
            raise ValueError("First name must be at least 2 characters long")
        if not re.match(r'^[a-zA-Z\s]+$', first_name):
            raise ValueError("First name can only contain letters and spaces")
        return first_name.strip().title()
    
    @validates('last_name')
    def validate_last_name(self, key, last_name):
        if not last_name or len(last_name.strip()) < 2:
            raise ValueError("Last name must be at least 2 characters long")
        if not re.match(r'^[a-zA-Z\s]+$', last_name):
            raise ValueError("Last name can only contain letters and spaces")
        return last_name.strip().title()
    
    @validates('email')
    def validate_email(self, key, email):
        if not email or len(email.strip()) < 5:
            raise ValueError("Email must be at least 5 characters long")
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            raise ValueError("Invalid email format")
        return email.strip().lower()
    
    @validates('password')
    def validate_password(self, key, password):
        if password is None:
            return password  # Allow null passwords for Google users
        if not password or len(password) < 6:
            raise ValueError("Password must be at least 6 characters long")
        return password
    
    @validates('phone_no')
    def validate_phone_no(self, key, phone_no):
        if phone_no is None:
            return phone_no
        phone_no = phone_no.strip()
        if not phone_no:
            return None
        # Pakistani phone number format: +92XXXXXXXXXX or 03XXXXXXXXX
        phone_pattern = r'^(\+92|0)?[0-9]{10}$'
        if not re.match(phone_pattern, phone_no):
            raise ValueError("Invalid phone number format. Use Pakistani format: +92XXXXXXXXXX or 03XXXXXXXXX")
        return phone_no
    
    @validates('cnic')
    def validate_cnic(self, key, cnic):
        if cnic is None:
            return cnic
        cnic = cnic.strip()
        if not cnic:
            return None
        # Pakistani CNIC format: XXXXX-XXXXXXX-X
        cnic_pattern = r'^\d{5}-\d{7}-\d$'
        if not re.match(cnic_pattern, cnic):
            raise ValueError("Invalid CNIC format. Use format: XXXXX-XXXXXXX-X")
        return cnic
    
    @validates('gender')
    def validate_gender(self, key, gender):
        if not gender:
            raise ValueError("Gender is required and cannot be empty")
        if gender not in [GenderEnum.MALE.value, GenderEnum.FEMALE.value]:
            raise ValueError("Gender must be either 'male' or 'female'")
        return gender
    
    @validates('bio')
    def validate_bio(self, key, bio):
        if bio is None:
            return bio
        if len(bio) > 1000:
            raise ValueError("Bio cannot exceed 1000 characters")
        return bio.strip()
    
    @validates('wallet')
    def validate_wallet(self, key, wallet):
        if wallet < 0:
            raise ValueError("Wallet balance cannot be negative")
        return round(wallet, 2)
    
    @validates('average_rating')
    def validate_average_rating(self, key, rating):
        if rating < 0 or rating > 5:
            raise ValueError("Average rating must be between 0 and 5")
        return round(rating, 2)
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Ensure new users start with a rating of 5.0
        if self.average_rating is None:
            self.average_rating = 5.0
    
    @validates('driving_license')
    def validate_driving_license(self, key, license):
        if license is None:
            return license
        if len(license) > 100:
            raise ValueError("Driving license number cannot exceed 100 characters")
        return license.strip() 