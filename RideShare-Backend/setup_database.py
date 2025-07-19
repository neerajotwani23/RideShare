#!/usr/bin/env python3
"""
Database Setup Script for RideShare Backend
Creates all necessary tables in the database
"""

import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database import setup_database_schema

def main():
    """Main function to setup the database"""
    print("🚀 Starting RideShare Database Setup...")
    print("=" * 50)
    
    try:
        # Setup database schema
        setup_database_schema()
        
        print("=" * 50)
        print("✅ Database setup completed successfully!")
        print("🎉 All tables have been created and are ready to use.")
        
    except Exception as e:
        print("=" * 50)
        print(f"❌ Database setup failed: {e}")
        print("💡 Please check your database connection and try again.")
        sys.exit(1)

if __name__ == "__main__":
    main() 