from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from fastapi import HTTPException

from ..models import RideRequest, Ride
from .. import schemas

class RideRequestRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, ride_request: schemas.RideRequestCreate) -> RideRequest:
        # Check if ride exists and is active
        ride = self.db.query(Ride).filter(Ride.id == ride_request.ride_id).first()
        if not ride:
            raise HTTPException(status_code=404, detail="Ride not found")
        
        if ride.status not in ["PENDING", "ACTIVE", "CONFIRMED"]:
            raise HTTPException(status_code=400, detail="Ride is not available for requests")
        
        # Check if user is trying to request their own ride
        if ride.user_id == ride_request.user_id:
            raise HTTPException(
                status_code=400,
                detail="You cannot request your own ride"
            )
        
        # Check if user already has a pending request for this ride
        existing_request = self.db.query(RideRequest).filter(
            RideRequest.user_id == ride_request.user_id,
            RideRequest.ride_id == ride_request.ride_id,
            RideRequest.status == "pending"
        ).first()
        
        if existing_request:
            raise HTTPException(
                status_code=400, 
                detail="You already have a pending request for this ride"
            )
        
        # Check if ride has enough available seats
        total_requested_seats = self.db.query(RideRequest).filter(
            RideRequest.ride_id == ride_request.ride_id,
            RideRequest.status.in_(["pending", "accepted"])
        ).with_entities(func.sum(RideRequest.seats)).scalar() or 0
        
        if total_requested_seats + ride_request.seats > ride.seats_offered:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough seats available. Only {ride.seats_offered - total_requested_seats} seats left."
            )
        
        db_request = RideRequest(**ride_request.dict())
        self.db.add(db_request)
        self.db.commit()
        self.db.refresh(db_request)
        return db_request
    
    def get_by_id(self, request_id: int) -> Optional[RideRequest]:
        return self.db.query(RideRequest).filter(RideRequest.id == request_id).first()
    
    def get_by_user_id(self, user_id: int) -> List[RideRequest]:
        return self.db.query(RideRequest).filter(RideRequest.user_id == user_id).all()
    
    def get_by_ride_id(self, ride_id: int) -> List[RideRequest]:
        return self.db.query(RideRequest).filter(RideRequest.ride_id == ride_id).all()
    
    def update_status(self, request_id: int, status: str) -> RideRequest:
        db_request = self.get_by_id(request_id)
        if not db_request:
            raise HTTPException(status_code=404, detail="Ride request not found")
        
        db_request.status = status
        self.db.commit()
        self.db.refresh(db_request)
        return db_request 