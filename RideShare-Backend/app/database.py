from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database URL from environment variable
# Default to SQLite for development, but can be overridden for MySQL
#DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sobia.db")

# For PostgreSQL (Neon DB), use this format:
DATABASE_URL = os.getenv("DATABASE_URL", 'postgresql://neondb_owner:npg_8jPJKnTNUi9L@ep-snowy-night-a1y5r19x-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require')
print(f"🔗 Connecting to database: {DATABASE_URL.split('@')[0] if '@' in DATABASE_URL else DATABASE_URL}")

# Engine configuration
if "sqlite" in DATABASE_URL:
    # SQLite specific configuration
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    # PostgreSQL specific configuration  
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
        echo=True  # Set to True for SQL query logging
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Function to setup database schema
def setup_database_schema():
    """Create database tables if they don't exist"""
    print("🗑️  Checking database schema...")
    
    try:
        # Import Base here to avoid circular imports
        from .models import Base
        
        # Check if tables already exist
        with engine.connect() as connection:
            try:
                if "sqlite" in DATABASE_URL:
                    result = connection.execute(text("SELECT name FROM sqlite_master WHERE type='table'"))
                else:
                    result = connection.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
                existing_tables = [row[0] for row in result]
                
                if existing_tables:
                    print(f"ℹ️  Found {len(existing_tables)} existing tables: {existing_tables}")
                    print("✅ Database schema already exists, skipping creation")
                    return
                else:
                    print("ℹ️  No existing tables found")
            except Exception as e:
                print(f"⚠️  Could not check existing tables: {e}")
                print("ℹ️  Proceeding with table creation...")
        
        print("🏗️  Creating tables with updated schema...")
        Base.metadata.create_all(bind=engine)
        
        print("✅ Database schema setup completed successfully!")
        print("📋 Schema includes:")
        print("  - Proper enum types for user_type, ride_status, gender_preference")
        print("  - Updated field names (seats_offered instead of seats)")
        print("  - Proper relationships and constraints")
        
    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        raise

# Uncomment the line below to automatically reset database on startup
# reset_database_schema()

Base = declarative_base()