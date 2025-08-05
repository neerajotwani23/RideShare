from app.repositories.stripe_repository import StripeRepository


class StripeService:
    def __init__(self):
        # PaymentRepository doesn't require DB since it’s Stripe-only
        self.stripe_repo = StripeRepository()

    def initiate_payment(self, amount: int, currency: str = "usd") -> dict:
        """
        Prepares Stripe payment (customer, ephemeral key, payment intent).
        Returns necessary data for frontend payment sheet.
        """
        return self.stripe_repo.prepare_payment(amount=amount, currency=currency)
