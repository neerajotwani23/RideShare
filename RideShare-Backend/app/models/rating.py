from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime, CheckConstraint
from sqlalchemy.orm import relationship, validates
from sqlalchemy.sql import func
from .base import Base

class RatingsReviews(Base):
    __tablename__ = "ratingsreview"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    reviewer_id = Column(Integer, ForeignKey("user.id"), nullable=False)  # User giving the review
    reviewee_id = Column(Integer, ForeignKey("user.id"), nullable=False)  # User receiving the review
    stars = Column(Integer, nullable=False)  # 1-5 rating
    text_review = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now())
    
    # Database-level constraints
    __table_args__ = (
        CheckConstraint('stars >= 1 AND stars <= 5', name='check_stars_range'),
        CheckConstraint('reviewer_id != reviewee_id', name='check_different_users'),
        CheckConstraint('length(text_review) <= 1000 OR text_review IS NULL', name='check_text_review_length'),
    )
    
    # Relationships
    reviewer = relationship("User", foreign_keys=[reviewer_id], back_populates="reviews_given")
    reviewee = relationship("User", foreign_keys=[reviewee_id], back_populates="reviews_received")
    
    # Validation methods
    @validates('stars')
    def validate_stars(self, key, stars):
        if stars < 1 or stars > 5:
            raise ValueError("Rating must be between 1 and 5 stars")
        return stars
    
    @validates('text_review')
    def validate_text_review(self, key, text_review):
        if text_review is None:
            return text_review
        text_review = text_review.strip()
        if not text_review:
            return None
        if len(text_review) > 1000:
            raise ValueError("Review text cannot exceed 1000 characters")
        return text_review
    
    @validates('reviewer_id')
    def validate_reviewer_id(self, key, reviewer_id):
        if reviewer_id is None:
            raise ValueError("Reviewer ID is required")
        return reviewer_id
    
    @validates('reviewee_id')
    def validate_reviewee_id(self, key, reviewee_id):
        if reviewee_id is None:
            raise ValueError("Reviewee ID is required")
        return reviewee_id 