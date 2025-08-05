from fastapi import APIRouter, HTTPException, status
from app.services import StripeService

class StripeController:
    def __init__(self):
        self.router = APIRouter(prefix="/stripe")
        self.stripe_service = StripeService()
        
        # Register endpoints
        self.router.post("/initiate")(self.initiate_payment)

    def initiate_payment(self, amount: int, currency: str = "usd"):
        """
        Create Stripe payment intent, customer, and ephemeral key.
        Returns values needed for Stripe PaymentSheet.
        """
        try:
            result = self.stripe_service.initiate_payment(amount=amount, currency=currency)
            return result
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e)
            )
