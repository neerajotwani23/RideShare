from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from typing import List, Optional
from fastapi import HTTPException

from ..models import Ride
from .. import schemas

class RideRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, ride: schemas.RideCreate) -> Ride:
        db_ride = Ride(**ride.dict())
        self.db.add(db_ride)
        self.db.commit()
        self.db.refresh(db_ride)
        return db_ride
    
    def get_by_id(self, ride_id: int) -> Optional[Ride]:
        return self.db.query(Ride).filter(Ride.id == ride_id).first()
    
    def get_by_user_id(self, user_id: int) -> List[Ride]:
        return self.db.query(Ride).filter(Ride.user_id == user_id).all()
    
    def search(self, search_params: schemas.RideSearchParams, skip: int = 0, limit: int = 10, user_preferences: Optional[dict] = None) -> List[Ride]:
        query = self.db.query(Ride).filter(Ride.status.in_(["PENDING", "ACTIVE", "CONFIRMED"]))
        
        if search_params.source:
            query = query.filter(Ride.source.ilike(f"%{search_params.source}%"))
        if search_params.destination:
            query = query.filter(Ride.destination.ilike(f"%{search_params.destination}%"))
        if search_params.date:
            search_date = datetime.strptime(search_params.date, "%Y-%m-%d").date()
            query = query.filter(func.date(Ride.timing) == search_date)
        if search_params.min_seats:
            query = query.filter(Ride.seats_offered >= search_params.min_seats)
        if search_params.max_fare:
            query = query.filter(Ride.fare <= search_params.max_fare)
        if search_params.ac is not None:
            query = query.filter(Ride.ac == search_params.ac)
        if search_params.smoking is not None:
            query = query.filter(Ride.smoking == search_params.smoking)
        if search_params.music is not None:
            query = query.filter(Ride.music == search_params.music)
        if search_params.gender_preference is not None:
            query = query.filter(Ride.gender_preference == search_params.gender_preference)
        
        # Get all rides first for sorting
        rides = query.all()
        
        # Sort rides based on user preferences and fare
        if user_preferences:
            rides = self._sort_rides_by_preferences(rides, user_preferences)
        else:
            # Default sorting: lowest fare first, then by timing
            rides.sort(key=lambda x: (x.fare, x.timing))
        
        return rides[skip:skip + limit]
    
    def _sort_rides_by_preferences(self, rides: List[Ride], user_preferences: dict) -> List[Ride]:
        """Sort rides based on user preferences and fare"""
        def calculate_score(ride):
            score = 0
            
            # Base score: lower fare gets higher score (inverted)
            max_fare = max([r.fare for r in rides]) if rides else 100
            fare_score = (max_fare - ride.fare) / max_fare * 100
            score += fare_score * 0.4  # 40% weight for fare
            
            # Preference matching
            if user_preferences.get('ac') is not None and ride.ac == user_preferences['ac']:
                score += 20
            if user_preferences.get('smoking') is not None and ride.smoking == user_preferences['smoking']:
                score += 15
            if user_preferences.get('music') is not None and ride.music == user_preferences['music']:
                score += 10
            if user_preferences.get('gender_preference') and ride.gender_preference == user_preferences['gender_preference']:
                score += 15
            
            # Timing preference (closer to preferred time gets higher score)
            if user_preferences.get('preferred_time'):
                try:
                    preferred_time = datetime.strptime(user_preferences['preferred_time'], "%H:%M").time()
                    ride_time = ride.timing.time()
                    time_diff = abs((ride_time.hour * 60 + ride_time.minute) - (preferred_time.hour * 60 + preferred_time.minute))
                    time_score = max(0, 20 - time_diff)  # Max 20 points for perfect timing
                    score += time_score
                except:
                    pass
            
            # Driver rating bonus (if available)
            if hasattr(ride, 'driver') and ride.driver and hasattr(ride.driver, 'average_rating'):
                rating_bonus = ride.driver.average_rating * 5  # 5 points per star
                score += rating_bonus
            
            return score
        
        # Sort by calculated score (highest first)
        rides.sort(key=calculate_score, reverse=True)
        return rides
    
    def update(self, ride_id: int, ride_update: schemas.RideUpdate) -> Ride:
        db_ride = self.get_by_id(ride_id)
        if not db_ride:
            raise HTTPException(status_code=404, detail="Ride not found")
        
        update_data = ride_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_ride, field, value)
        
        self.db.commit()
        self.db.refresh(db_ride)
        return db_ride
    
    def cancel(self, ride_id: int) -> Ride:
        db_ride = self.get_by_id(ride_id)
        if not db_ride:
            raise HTTPException(status_code=404, detail="Ride not found")
        
        db_ride.status = "cancelled"
        self.db.commit()
        self.db.refresh(db_ride)
        return db_ride 