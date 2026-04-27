from datetime import datetime

from pydantic import BaseModel, Field


class OrderItemCreate(BaseModel):
    menu_id: int
    quantity: int = Field(ge=1, le=99)


class OrderCreate(BaseModel):
    store_id: int
    table_id: int
    session_id: int | None = None
    items: list[OrderItemCreate] = Field(min_length=1)


class OrderItemResponse(BaseModel):
    id: int
    menu_item_id: int
    menu_name: str
    quantity: int
    unit_price: int
    subtotal: int

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: int
    store_id: int
    table_id: int
    session_id: int
    order_number: str
    status: str
    total_amount: int
    is_deleted: bool
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemResponse] = []

    model_config = {"from_attributes": True}


class OrderStatusUpdate(BaseModel):
    status: str = Field(pattern="^(pending|preparing|completed)$")


class OrderHistoryResponse(BaseModel):
    id: int
    store_id: int
    table_id: int
    table_number: int
    session_id: int
    order_id: int
    order_number: str
    order_data: str
    total_amount: int
    ordered_at: datetime
    completed_at: datetime

    model_config = {"from_attributes": True}
