from datetime import datetime

from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    sort_order: int = 0


class CategoryUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=50)
    sort_order: int | None = None


class CategoryResponse(BaseModel):
    id: int
    store_id: int
    name: str
    sort_order: int
    created_at: datetime

    model_config = {"from_attributes": True}


class MenuItemCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    price: int = Field(ge=0)
    description: str | None = Field(None, max_length=1000)
    category_id: int
    image_url: str | None = Field(None, max_length=500)


class MenuItemUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    price: int | None = Field(None, ge=0)
    description: str | None = Field(None, max_length=1000)
    category_id: int | None = None
    image_url: str | None = Field(None, max_length=500)
    is_available: bool | None = None


class MenuItemResponse(BaseModel):
    id: int
    store_id: int
    category_id: int
    name: str
    price: int
    description: str | None
    image_url: str | None
    sort_order: int
    is_available: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class MenuReorderRequest(BaseModel):
    menu_ids: list[int]
