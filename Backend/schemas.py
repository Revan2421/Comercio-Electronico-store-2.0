from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    
    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None

class UserActivity(BaseModel):
    total_orders: int
    last_order_date: Optional[datetime]
    account_created: datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Product Schemas
class ProductBase(BaseModel):
    name: str
    price: float
    description: str
    image: str
    category: str

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        orm_mode = True

# Order Schemas
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    items: List[OrderItemBase]

class OrderItem(OrderItemBase):
    id: int
    price: float

    class Config:
        orm_mode = True

class Order(BaseModel):
    id: int
    user_id: int
    total_price: float
    status: str
    created_at: datetime
    items: List[OrderItem]

    class Config:
        orm_mode = True

# Payment Schema
class PaymentCreate(BaseModel):
    order_id: int
    amount: float
    card_number: str
    cvv: str
    expiry: str
    bank_id: str
    description: Optional[str] = "Payment for order"
