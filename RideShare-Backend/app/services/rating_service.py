from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from ..repositories import RatingRepository, UserRepository
from ..models import RatingsReviews
from .. import schemas

class RatingService:
    def __init__(self, db: Session):
        self.db = db
        self.rating_repo = RatingRepository(db)
        self.user_repo = UserRepository(db)
    
    def create_rating(self, rating: schemas.RatingCreate) -> RatingsReviews:
        """Create a new rating and update user's average rating"""
        db_rating = self.rating_repo.create(rating)
        
        # Update the reviewee's average rating
        self.user_repo.update_rating(rating.reviewee_id)
        
        return db_rating
    
    def get_ride_ratings(self, ride_id: int) -> List[RatingsReviews]:
        """Get all ratings for a specific ride"""
        return self.rating_repo.get_by_ride_id(ride_id)
    
    def get_user_ratings(self, user_id: int) -> List[RatingsReviews]:
        """Get all ratings given by a user"""
        return self.rating_repo.get_by_user_id(user_id)
    
    def calculate_user_average_rating(self, user_id: int) -> Optional[float]:
        """Calculate the average rating for a user"""
        ratings = self.db.query(RatingsReviews).filter(RatingsReviews.reviewee_id == user_id).all()
        if not ratings:
            return 5.0  # Default rating if no reviews
        
        total_rating = sum(rating.stars for rating in ratings)
        return round(total_rating / len(ratings), 2)
    
    def get_reviews_received_by_user(self, user_id: int) -> List[RatingsReviews]:
        """Get all ratings/reviews received by a user"""
        return self.db.query(RatingsReviews).filter(RatingsReviews.reviewee_id == user_id).all()
    
    def get_reviews_given_by_user(self, user_id: int) -> List[RatingsReviews]:
        """Get all ratings/reviews given by a user"""
        return self.db.query(RatingsReviews).filter(RatingsReviews.reviewer_id == user_id).all()
    
    def verify_ride_participation(self, user_id: int, other_user_id: int, ride_id: int) -> bool:
        """Verify that both users participated in the same ride"""
        # This is a placeholder implementation
        # In a real app, you would check the ride requests/participants table
        # For now, we'll allow rating (you can implement proper verification later)
        return True 