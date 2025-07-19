#!/usr/bin/env python3
"""
Database table verification script
"""

from sqlalchemy import inspect, text
from app.database import engine, SessionLocal
from app.models import Base

def check_tables():
    """Check if all required tables exist"""
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    
    # Expected tables based on models (using actual table names from database)
    expected_tables = [
        'user',
        'vehicle', 
        'ride',
        'riderequest',
        'transaction',
        'ratingsreview',
        'payment'
    ]
    
    print("=== Database Table Check ===")
    print(f"Database URL: {engine.url}")
    print()
    
    missing_tables = []
    for table in expected_tables:
        if table in existing_tables:
            print(f"✅ {table} - EXISTS")
        else:
            print(f"❌ {table} - MISSING")
            missing_tables.append(table)
    
    print()
    if missing_tables:
        print(f"❌ Missing tables: {missing_tables}")
        print("Run database setup to create missing tables")
        return False
    else:
        print("✅ All tables exist!")
        return True

def check_table_columns():
    """Check if tables have the expected columns"""
    inspector = inspect(engine)
    
    print("\n=== Table Column Check ===")
    
    # Check user table
    if 'user' in inspector.get_table_names():
        user_columns = [col['name'] for col in inspector.get_columns('user')]
        print(f"User table columns: {user_columns}")
    
    # Check ride table  
    if 'ride' in inspector.get_table_names():
        ride_columns = [col['name'] for col in inspector.get_columns('ride')]
        print(f"Ride table columns: {ride_columns}")

def test_connection():
    """Test database connection"""
    try:
        with SessionLocal() as db:
            result = db.execute(text("SELECT 1"))
            print("✅ Database connection successful")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

if __name__ == "__main__":
    print("Checking RideShare database...")
    print()
    
    if test_connection():
        check_tables()
        check_table_columns()
    else:
        print("Cannot check tables - database connection failed") 