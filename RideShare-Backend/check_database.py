#!/usr/bin/env python3
"""
Script to check database contents
"""

import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from database import SessionLocal
from models import User, Ride

def check_database():
    """Check what's in the database"""
    db = SessionLocal()
    try:
        # Check users
        users = db.query(User).all()
        print(f"Total users: {len(users)}")
        for user in users:
            print(f"- User: {user.first_name} {user.last_name} ({user.user_type}) - ID: {user.id}")
        
        # Check rides
        rides = db.query(Ride).all()
        print(f"\nTotal rides: {len(rides)}")
        for ride in rides:
            print(f"- Ride: {ride.source} to {ride.destination} by Driver {ride.driver_id} - Fare: ${ride.fare}")
        
    except Exception as e:
        print(f"Error checking database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_database() 