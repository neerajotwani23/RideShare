import os
import stripe
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")  # Use secret key securely

STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY")
STRIPE_API_VERSION = "2025-07-30.basil"  # or latest version supported by SDK
