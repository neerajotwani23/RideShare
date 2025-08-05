import enum
from sqlalchemy import Column, Integer, DateTime, ForeignKey, Enum as SQLEnum, Numeric, CheckConstraint,String
from sqlalchemy.orm import relationship, validates
from sqlalchemy.sql import func
from .base import Base
from decimal import Decimal
class TransactionTypeEnum(enum.Enum):
    DEBIT = "debit"
    CREDIT = "credit"

class Transaction(Base):
    __tablename__ = "transaction"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    stripe_id = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    ride_id = Column(Integer, ForeignKey("ride.id"), nullable=True)
    type = Column(SQLEnum(TransactionTypeEnum), nullable=False)
    datetime = Column(DateTime, default=func.now())
    amount = Column(Numeric(10, 2), nullable=False)
    
    # Database-level constraints
    __table_args__ = (
        CheckConstraint('amount > 0', name='check_amount_positive'),
        CheckConstraint('amount <= 100000', name='check_amount_max'),
    )
    
    # Relationships
    user = relationship("User", back_populates="transaction")
    ride = relationship("Ride", back_populates="transaction")
    payment = relationship("Payment", back_populates="transaction", uselist=False)
    
    # Validation methods
    @validates('amount')
    def validate_amount(self, key, amount):
        if amount <= 0:
            raise ValueError("Transaction amount must be greater than 0")
        if amount > 100000:
            raise ValueError("Transaction amount cannot exceed 100,000")
        return round(amount, 2)
    
    @validates('type')
    def validate_type(self, key, type):
        if type not in TransactionTypeEnum:
            raise ValueError("Invalid transaction type")
        return type 