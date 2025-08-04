import os
from dotenv import load_dotenv

load_dotenv()

STRIPE_SECRET_KEY = os.getenv("Stripe_Secret_Key")
STRIPE_PUBLISHABLE_KEY = os.getenv("Stripe_Publishable_Key")