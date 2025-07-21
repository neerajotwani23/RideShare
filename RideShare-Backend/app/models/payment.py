import enum
from sqlalchemy import Column, Integer, ForeignKey, Enum as SQLEnum, DateTime, CheckConstraint
from sqlalchemy.orm import relationship, validates
from sqlalchemy.sql import func
from .base import Base

class PaymentTypeEnum(enum.Enum):
    CASH = "cash"
    WALLET = "wallet"

class Payment(Base):
    __tablename__ = "payment"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    type = Column(SQLEnum(PaymentTypeEnum), nullable=False)
    transaction_id = Column(Integer, ForeignKey("transaction.id"), nullable=False, unique=True)
    from_user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    to_user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    created_at = Column(DateTime, default=func.now())
    
    # Database-level constraints
    __table_args__ = (
        CheckConstraint('from_user_id != to_user_id', name='check_different_users'),
    )
    
    # Relationships
    transaction = relationship("Transaction", back_populates="payment")
    sender = relationship("User", foreign_keys=[from_user_id], back_populates="payments_sent")
    receiver = relationship("User", foreign_keys=[to_user_id], back_populates="payments_received")
    
    # Validation methods
    @validates('type')
    def validate_type(self, key, type):
        if type not in PaymentTypeEnum:
            raise ValueError("Invalid payment type")
        return type
    
    @validates('from_user_id')
    def validate_from_user_id(self, key, from_user_id):
        if from_user_id is None:
            raise ValueError("Sender user ID is required")
        return from_user_id
    
    @validates('to_user_id')
    def validate_to_user_id(self, key, to_user_id):
        if to_user_id is None:
            raise ValueError("Receiver user ID is required")
        return to_user_id
    
    @validates('transaction_id')
    def validate_transaction_id(self, key, transaction_id):
        if transaction_id is None:
            raise ValueError("Transaction ID is required")
        return transaction_id 