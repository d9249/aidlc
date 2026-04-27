from pydantic import BaseModel


class AdminLoginRequest(BaseModel):
    store_identifier: str
    username: str
    password: str


class TableLoginRequest(BaseModel):
    store_identifier: str
    table_number: int
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str | None = None
    table_id: int | None = None
    session_id: int | None = None
    store_id: int | None = None
    store_name: str | None = None


class UserInfo(BaseModel):
    user_type: str
    id: int
    store_id: int
    role: str | None = None
