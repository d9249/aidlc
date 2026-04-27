from datetime import datetime

from pydantic import BaseModel, Field


class TableCreate(BaseModel):
    store_id: int
    table_number: int = Field(ge=1)
    password: str = Field(min_length=1)


class TableResponse(BaseModel):
    id: int
    store_id: int
    table_number: int
    current_session_id: int | None
    created_at: datetime

    model_config = {"from_attributes": True}


class TableSessionResponse(BaseModel):
    id: int
    table_id: int
    store_id: int
    started_at: datetime
    completed_at: datetime | None
    is_active: bool
    total_amount: int

    model_config = {"from_attributes": True}
