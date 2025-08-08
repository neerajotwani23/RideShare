#!/usr/bin/env python3
"""
Check enum values in database
"""

import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database import SessionLocal
from sqlalchemy import text

def check_enum_values():
    """Check what enum values exist in the database"""
    print("🔍 Checking enum values in database...")
    print("=" * 50)
    
    try:
        db = SessionLocal()
        
        # Check what enum types exist
        print("1. Checking enum types...")
        result = db.execute(text("""
            SELECT t.typname, e.enumlabel 
            FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid 
            WHERE t.typname LIKE '%status%' OR t.typname LIKE '%enum%'
            ORDER BY t.typname, e.enumsortorder
        """))
        
        enum_values = {}
        for row in result:
            enum_name = row[0]
            enum_value = row[1]
            if enum_name not in enum_values:
                enum_values[enum_name] = []
            enum_values[enum_name].append(enum_value)
        
        for enum_name, values in enum_values.items():
            print(f"   {enum_name}: {values}")
        
        # Check the actual values in the ride table
        print("\n2. Checking actual values in ride.status column...")
        result = db.execute(text("SELECT DISTINCT status FROM ride"))
        actual_values = [row[0] for row in result]
        print(f"   Actual values in ride.status: {actual_values}")
        
        # Check the column type
        print("\n3. Checking ride.status column type...")
        result = db.execute(text("""
            SELECT column_name, data_type, udt_name 
            FROM information_schema.columns 
            WHERE table_name = 'ride' AND column_name = 'status'
        """))
        
        for row in result:
            print(f"   Column: {row[0]}, Type: {row[1]}, UDT: {row[2]}")
        
        db.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_enum_values() 