from sqlalchemy.orm import Session
from typing import List, Optional

from ..repositories import RideRepository
from ..models import Ride
from .. import schemas

class RideService:
    def __init__(self, db: Session):
        self.db = db
        self.ride_repo = RideRepository(db)
    
    def create_ride(self, ride: schemas.RideCreate) -> Ride:
        """Create a new ride with validation"""
        # Additional business logic can be added here
        # e.g., check if user has a valid driving license for driver rides
        return self.ride_repo.create(ride)
    
    def get_ride_by_id(self, ride_id: int) -> Optional[Ride]:
        """Get ride by ID"""
        return self.ride_repo.get_by_id(ride_id)
    
    def get_user_rides(self, user_id: int) -> List[Ride]:
        """Get all rides created by a user"""
        return self.ride_repo.get_by_user_id(user_id)
    
    def search_rides(self, search_params: schemas.RideSearchParams, skip: int = 0, limit: int = 10, user_preferences: Optional[dict] = None) -> List[Ride]:
        """Search for available rides based on criteria with smart sorting"""
        return self.ride_repo.search(search_params, skip, limit, user_preferences)
    
    def update_ride(self, ride_id: int, ride_update: schemas.RideUpdate) -> Ride:
        """Update ride information"""
        return self.ride_repo.update(ride_id, ride_update)
    
    def cancel_ride(self, ride_id: int) -> Ride:
        """Cancel a ride"""
        return self.ride_repo.cancel(ride_id)
    
    def complete_ride(self, ride_id: int) -> Ride:
        """Mark a ride as completed"""
        ride_update = schemas.RideUpdate(status="completed")
        return self.ride_repo.update(ride_id, ride_update)
    
    def get_upcoming_rides(self, user_id: int) -> List[Ride]:
        """Get upcoming rides for a user"""
        from datetime import datetime
        return self.db.query(Ride).filter(
            Ride.user_id == user_id,
            Ride.timing > datetime.now(),
            Ride.status.in_(["PENDING", "ACTIVE", "CONFIRMED"])
        ).all()
    
    def get_past_rides(self, user_id: int) -> List[Ride]:
        """Get past rides for a user"""
        from datetime import datetime
        return self.db.query(Ride).filter(
            Ride.user_id == user_id,
            Ride.timing < datetime.now()
        ).all()
    
    def get_rides_by_status(self, user_id: int, status) -> List[Ride]:
        """Get rides by status for a user"""
        return self.db.query(Ride).filter(
            Ride.user_id == user_id,
            Ride.status == status
        ).all()
    
    def update_ride_status(self, ride_id: int, status) -> Ride:
        """Update ride status"""
        ride_update = schemas.RideUpdate(status=status)
        return self.ride_repo.update(ride_id, ride_update) 