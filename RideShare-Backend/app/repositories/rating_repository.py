from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException

from ..models import RatingsReviews
from .. import schemas

class RatingRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, rating: schemas.RatingCreate) -> RatingsReviews:
        # Check if user already rated this specific user
        existing_rating = self.db.query(RatingsReviews).filter(
            RatingsReviews.reviewer_id == rating.reviewer_id,
            RatingsReviews.reviewee_id == rating.reviewee_id
        ).first()
        
        if existing_rating:
            raise HTTPException(
                status_code=400,
                detail="You have already rated this user"
            )
        
        # Prevent self-rating
        if rating.reviewer_id == rating.reviewee_id:
            raise HTTPException(
                status_code=400,
                detail="You cannot rate yourself"
            )
        
        db_rating = RatingsReviews(**rating.dict())
        self.db.add(db_rating)
        self.db.commit()
        self.db.refresh(db_rating)
        return db_rating
    
    def get_by_reviewer_id(self, reviewer_id: int) -> List[RatingsReviews]:
        """Get all ratings given by a specific user"""
        return self.db.query(RatingsReviews).filter(RatingsReviews.reviewer_id == reviewer_id).all()
    
    def get_by_reviewee_id(self, reviewee_id: int) -> List[RatingsReviews]:
        """Get all ratings received by a specific user"""
        return self.db.query(RatingsReviews).filter(RatingsReviews.reviewee_id == reviewee_id).all()
    
    def get_by_ride_id(self, ride_id: int) -> List[RatingsReviews]:
        """Get all ratings for a specific ride (if ride_id is added to the model later)"""
        # For now, return empty list since ride_id is not in the current model
        return []
    
    def get_by_user_id(self, user_id: int) -> List[RatingsReviews]:
        """Get all ratings given by a user (deprecated, use get_by_reviewer_id)"""
        return self.get_by_reviewer_id(user_id) 