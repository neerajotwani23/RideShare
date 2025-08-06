from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os

from ..services import UserService
from ..models import User
from .. import schemas
from ..database import SessionLocal

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
# SECRET_KEY = "123ABCDEFGHIJKLMNOPQRSTWYZIKLUHHBJH"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30  # 30 days (1 month)
REFRESH_TOKEN_EXPIRE_DAYS = 60  # 60 days (2 months) for refresh tokens

security = HTTPBearer()

class AuthController:
    def __init__(self):
        self.router = APIRouter(prefix="/auth", tags=["Authentication"])
        self._setup_routes()
    
    def _setup_routes(self):
        self.router.add_api_route("/register", self.register_user, methods=["POST"], response_model=schemas.UserResponse)
        self.router.add_api_route("/login", self.login_user, methods=["POST"])
        self.router.add_api_route("/google-login", self.google_login, methods=["POST"])
        self.router.add_api_route("/refresh", self.refresh_token, methods=["POST"])
        self.router.add_api_route("/me", self.get_current_user_info, methods=["GET"], response_model=schemas.UserResponse)
        self.router.add_api_route("/me", self.update_current_user, methods=["PUT"], response_model=schemas.UserResponse)
    
    @staticmethod
    def create_access_token(data: dict, expires_delta: timedelta = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def create_refresh_token(data: dict, expires_delta: timedelta = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire, "type": "refresh"})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
        try:

            payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: int = payload.get("sub")
            if user_id is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not validate credentials"
                )
            return user_id
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
    
    @staticmethod
    def get_current_user(
        user_id: int = Depends(verify_token),
        db: Session = Depends(get_db)
    ):
        user_service = UserService(db)
        user = user_service.get_user_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        return user
    
    def register_user(self, user: schemas.UserCreate, db: Session = Depends(get_db)):
        """Register a new user"""
        try:
            user_service = UserService(db)
            db_user = user_service.create_user(user)
            return db_user
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while creating the user"
            )
    
    def login_user(self, user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
        """Login user and return access token"""
        user_service = UserService(db)
        user = user_service.authenticate_user(user_credentials.email, user_credentials.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        access_token_expires = timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
        refresh_token_expires = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        
        access_token = self.create_access_token(
            data={"sub": str(user.id)}, expires_delta=access_token_expires
        )
        refresh_token = self.create_refresh_token(
            data={"sub": str(user.id)}, expires_delta=refresh_token_expires
        )
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": schemas.UserResponse.from_orm(user)
        }
    
    def refresh_token(self, token_data: schemas.RefreshToken, db: Session = Depends(get_db)):
        """Refresh access token using refresh token"""
        try:
            # Decode the refresh token
            payload = jwt.decode(token_data.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
            
            # Check if it's a refresh token
            if payload.get("type") != "refresh":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token type"
                )
            
            user_id: int = int(payload.get("sub"))
            if user_id is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not validate credentials"
                )
            
            # Verify user exists
            user_service = UserService(db)
            user = user_service.get_user_by_id(user_id)
            if user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not found"
                )
            
            # Create new access token
            access_token_expires = timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
            access_token = self.create_access_token(
                data={"sub": str(user.id)}, expires_delta=access_token_expires
            )
            
            return {
                "access_token": access_token,
                "token_type": "bearer"
            }
            
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate refresh token"
            )
    
    def get_current_user_info(self, current_user: User = Depends(get_current_user)):
        """Get current user information"""
        return current_user
    
    def update_current_user(
        self,
        user_update: schemas.UserUpdate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        """Update current user information"""
        user_service = UserService(db)
        return user_service.update_user(current_user.id, user_update)
    
    def google_login(self, google_data: dict, db: Session = Depends(get_db)):
        """Login or register user with Google"""
        try:
            user_service = UserService(db)
            
            # Extract and validate Google user data
            email = google_data.get("email")
            google_id = google_data.get("google_id")
            access_token = google_data.get("access_token")
            first_name = google_data.get("first_name", "")
            last_name = google_data.get("last_name", "")
            profile_picture = google_data.get("profile_picture", "")
            
            print(f"Google login attempt - Email: {email}, Google ID: {google_id}")
            print(f"First name: {first_name}, Last name: {last_name}")
            print(f"Profile picture: {profile_picture[:50] if profile_picture else 'None'}...")
            
            if not email or not google_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Missing required Google data: email and google_id are required"
                )
            
            # Validate email format
            import re
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, email):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid email format"
                )
            
            # Check if user exists by email
            user = user_service.get_user_by_email(email)
            
            if user:
                # User exists with this email
                print(f"User found with email {email}")
                
                if user.google_id:
                    # User already has Google ID linked
                    if user.google_id != google_id:
                        print(f"Google ID mismatch - stored: {user.google_id}, received: {google_id}")
                        raise HTTPException(
                            status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Google account mismatch. This email is linked to a different Google account."
                        )
                    # User exists and Google ID matches - proceed with login
                    print(f"Google ID matches - proceeding with login")
                else:
                    # User exists but no Google ID - link the Google account
                    print(f"Linking Google account to existing user")
                    user.google_id = google_id
                    if user.auth_provider == "email":
                        user.auth_provider = "both"
                    # Update profile picture if not already set
                    if not user.profile_picture and profile_picture:
                        user.profile_picture = profile_picture
                    db.commit()
                    db.refresh(user)
            else:
                # For new users, we don't need to check if Google ID exists
                # Google IDs can be reused if the previous user was deleted or never completed signup
                # Return Google data for signup completion
                print(f"New user - returning signup data")
                return {
                    "requires_signup": True,
                    "google_data": {
                        "email": email,
                        "google_id": google_id,
                        "first_name": first_name,
                        "last_name": last_name,
                        "profile_picture": profile_picture,
                        "auth_provider": "google"
                    }
                }
            
            # Create tokens
            access_token_expires = timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
            refresh_token_expires = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
            
            access_token = self.create_access_token(
                data={"sub": str(user.id)}, expires_delta=access_token_expires
            )
            refresh_token = self.create_refresh_token(
                data={"sub": str(user.id)}, expires_delta=refresh_token_expires
            )
            
            print(f"Google login successful for user {user.id}")
            
            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer",
                "user": schemas.UserResponse.from_orm(user)
            }
            
        except HTTPException as e:
            print(f"HTTP Exception in Google login: {e.detail}")
            raise e
        except Exception as e:
            print(f"Unexpected error in Google login: {e}")
            print(f"Error type: {type(e)}")
            import traceback
            traceback.print_exc()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An error occurred during Google authentication: {str(e)}"
            ) 

# Create router instance
auth_controller = AuthController()