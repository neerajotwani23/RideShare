from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .controllers.auth_controller import auth_controller
from .controllers.user_controller import user_controller
from .controllers.ride_controller import ride_controller
from .controllers.ride_request_controller import ride_request_controller
from .controllers.payment_controller import payment_controller
from .controllers.rating_controller import rating_controller
from .controllers.transaction_controller import transaction_controller
from .controllers.vehicle_controller import vehicle_controller
from .controllers.stripe_controller import stripe_controller
from .controllers.file_upload_controller import file_upload_controller

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Initialize Cloudinary service and log status
from .core.cloudinary_config import cloudinary_service
print("=== BACKEND STARTUP DEBUG ===")
print("Cloudinary service initialized")
print("=== END BACKEND STARTUP DEBUG ===")

app = FastAPI(title="RideShare API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_controller.router)
app.include_router(user_controller.router)
app.include_router(ride_controller.router)
app.include_router(ride_request_controller.router)
app.include_router(payment_controller.router)
app.include_router(rating_controller.router)
app.include_router(transaction_controller.router)
app.include_router(vehicle_controller.router)
app.include_router(stripe_controller.router)
app.include_router(file_upload_controller.router)

@app.get("/")
async def root():
    return {"message": "RideShare API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
