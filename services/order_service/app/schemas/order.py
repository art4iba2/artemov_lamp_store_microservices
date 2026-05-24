import uuid
from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

OrderStatus = Literal["new", "processing", "shipped", "completed", "cancelled"]


class OrderItemCreate(BaseModel):
    product_id: uuid.UUID
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    email: EmailStr
    phone: str = Field(min_length=5, max_length=30)
    items: list[OrderItemCreate] = Field(min_length=1)


class OrderItemRead(BaseModel):
    id: uuid.UUID
    order_id: uuid.UUID
    product_id: uuid.UUID
    quantity: int
    price: Decimal
    model_config = ConfigDict(from_attributes=True)


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class OrderRead(BaseModel):
    id: uuid.UUID
    email: str
    phone: str
    status: str = "new"
    created_at: datetime
    items: list[OrderItemRead]
    model_config = ConfigDict(from_attributes=True)


class OrderList(BaseModel):
    items: list[OrderRead]
    total: int
    page: int
    page_size: int
