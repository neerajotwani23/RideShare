#!/usr/bin/env python3
"""
Test database connection script
"""

from app.database import engine, DATABASE_URL
from sqlalchemy import text

def test_connection():
    print("🔗 Testing database connection...")
    print(f"Database URL: {DATABASE_URL.split('@')[0] if '@' in DATABASE_URL else DATABASE_URL}")
    
    try:
        with engine.connect() as connection:
            print("✅ Database connection successful!")
            
            # Test a simple query
            result = connection.execute(text("SELECT 1 as test"))
            print("✅ Database query test successful!")
            
            # Check if database exists
            try:
                result = connection.execute(text("SHOW TABLES"))
                tables = [row[0] for row in result]
                print(f"📋 Found {len(tables)} existing tables: {tables}")
            except Exception as e:
                print(f"⚠️  Could not list tables: {e}")
                
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    test_connection() 