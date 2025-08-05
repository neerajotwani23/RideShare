import stripe
from app.core.stripe_config import STRIPE_API_VERSION
from dotenv import load_dotenv
import os
load_dotenv()  # Load environment variables from .env


class StripeRepository:
    def __init__(self):
        # Make sure stripe.api_key is set in stripe_config.py
        pass

    # =============================
    # ✅ STRIPE METHODS ONLY
    # =============================

    def create_customer(self):
        """
        Create a Stripe customer.
        This can be reused across multiple payments.
        """
        return stripe.Customer.create()

    def create_ephemeral_key(self, customer_id: str):
        """
        Create a short-lived key for frontend (Stripe SDK) to access the customer.
        """
        return stripe.EphemeralKey.create(
            customer=customer_id,
            stripe_version=STRIPE_API_VERSION
        )

    def create_payment_intent(self, customer_id: str, amount: int, currency: str = "usd"):
        """
        Create a PaymentIntent for the customer. Used to initiate a payment.
        """
        return stripe.PaymentIntent.create(
            amount=amount,
            currency=currency,
            customer=customer_id,
            automatic_payment_methods={"enabled": True}
        )

    def prepare_payment(self, amount: int, currency: str = "usd"):
        """
        High-level method: creates customer, ephemeral key, and payment intent.
        Returns everything needed by frontend to show Stripe Payment Sheet.
        """
        # 1. Create customer
        customer = self.create_customer()

        # 2. Create ephemeral key
        ephemeral_key = self.create_ephemeral_key(customer.id)

        # 3. Create payment intent
        payment_intent = self.create_payment_intent(customer.id, amount, currency)

        # 4. Return secrets for frontend
        return {
            "paymentIntent": payment_intent.client_secret,
            "ephemeralKey": ephemeral_key.secret,
            "customer": customer.id,
            "publishableKey": os.getenv('STRIPE_PUBLISHABLE_KEY')  # frontend should use your publishable key (best to return separately)
        }
