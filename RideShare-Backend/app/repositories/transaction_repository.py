from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException
from decimal import Decimal

from ..models import Transaction, User
from .. import schemas

class TransactionRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, transaction: schemas.TransactionCreate) -> Transaction:
        # Check if user exists
        user = self.db.query(User).filter(User.id == transaction.user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Create transaction
        db_transaction = Transaction(**transaction.dict())
        self.db.add(db_transaction)
        
        # Update user wallet based on transaction type
        if transaction.type.value == "debit":
            amount_decimal = Decimal(str(transaction.amount))
            if user.wallet < amount_decimal:
                raise HTTPException(status_code=400, detail="Insufficient wallet balance")
            user.wallet -= amount_decimal
        else:  # credit
            user.wallet += Decimal(str(transaction.amount))
        
        self.db.commit()
        self.db.refresh(db_transaction)
        return db_transaction
    
    def get_by_user_id(self, user_id: int, skip: int = 0, limit: int = 10) -> List[Transaction]:
        return self.db.query(Transaction).filter(
            Transaction.user_id == user_id
        ).order_by(Transaction.datetime.desc()).offset(skip).limit(limit).all() 
    
    def create_stripe_transaction(self, transaction: schemas.TransactionStripeCreate) -> Transaction:
        """Create a transaction with Stripe integration"""
        # Check if user exists
        user = self.db.query(User).filter(User.id == transaction.user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Import the enum for proper type conversion
        from ..models.transaction import TransactionTypeEnum
        
        # Handle ride_id - only set it if it's a valid positive integer
        ride_id = transaction.ride_id if transaction.ride_id and transaction.ride_id > 0 else None
        
        # Create transaction with proper enum handling
        db_transaction = Transaction(
            user_id=transaction.user_id,
            ride_id=ride_id,  # Use the validated ride_id
            type=TransactionTypeEnum(transaction.type.value),  # Convert string back to enum
            amount=transaction.amount,
            stripe_id=transaction.stripe_id  # Now we can directly access stripe_id
        )
        
        self.db.add(db_transaction)
        
        # Update user wallet based on transaction type (for credit transactions)
        # For Stripe payments, we typically don't deduct from wallet since payment comes from external source
        if transaction.type.value == "credit":
             amount_to_add = Decimal(str(transaction.amount))
             current_wallet = Decimal(str(user.wallet)) if user.wallet is not None else Decimal('0.00')
             user.wallet = current_wallet + amount_to_add
        
        self.db.commit()
        self.db.refresh(db_transaction)
        return db_transaction