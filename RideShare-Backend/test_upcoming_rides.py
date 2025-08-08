#!/usr/bin/env python3
"""
Test script to debug upcoming rides issue
"""

import sys
import os
from datetime import datetime

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database import SessionLocal
from app.models import Ride, RideStatusEnum
from app.services import RideService

def test_upcoming_rides():
    """Test the upcoming rides functionality"""
    print("🧪 Testing upcoming rides functionality...")
    print("=" * 50)
    
    try:
        db = SessionLocal()
        
        # Test 1: Check if we can query rides at all
        print("1. Testing basic ride query...")
        all_rides = db.query(Ride).all()
        print(f"   Total rides in database: {len(all_rides)}")
        
        if all_rides:
            print("   Sample ride data:")
            for ride in all_rides[:3]:  # Show first 3 rides
                print(f"   - ID: {ride.id}, Status: {ride.status}, Timing: {ride.timing}")
        
        # Test 2: Check enum values
        print("\n2. Testing enum values...")
        print(f"   Available status values: {[e.value for e in RideStatusEnum]}")
        
        # Test 3: Test the service method directly
        print("\n3. Testing RideService.get_upcoming_rides...")
        ride_service = RideService(db)
        
        # Test with a sample user ID (assuming user 1 exists)
        try:
            upcoming_rides = ride_service.get_upcoming_rides(1)
            print(f"   Upcoming rides for user 1: {len(upcoming_rides)}")
            for ride in upcoming_rides:
                print(f"   - ID: {ride.id}, Status: {ride.status}, Timing: {ride.timing}")
        except Exception as e:
            print(f"   ❌ Error in get_upcoming_rides: {e}")
            import traceback
            traceback.print_exc()
        
        # Test 4: Check database schema
        print("\n4. Checking database schema...")
        from sqlalchemy import inspect
        inspector = inspect(db.bind)
        
        if 'ride' in inspector.get_table_names():
            ride_columns = inspector.get_columns('ride')
            print("   Ride table columns:")
            for col in ride_columns:
                print(f"   - {col['name']}: {col['type']}")
        
        db.close()
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_upcoming_rides() 