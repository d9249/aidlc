from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.auth import AdminLoginRequest, TableLoginRequest, TokenResponse, UserInfo
from app.services import auth_service

router = APIRouter()


@router.post("/admin/login", response_model=TokenResponse)
def admin_login(req: AdminLoginRequest, db: Session = Depends(get_db)):
    result = auth_service.login_admin(db, req.store_identifier, req.username, req.password)
    return TokenResponse(**result, token_type="bearer")


@router.post("/table/login", response_model=TokenResponse)
def table_login(req: TableLoginRequest, db: Session = Depends(get_db)):
    result = auth_service.login_table(db, req.store_identifier, req.table_number, req.password)
    return TokenResponse(**result, token_type="bearer")


@router.get("/me", response_model=UserInfo)
def get_me(user: dict = Depends(get_current_user)):
    return UserInfo(
        user_type=user["user_type"], id=int(user["sub"]),
        store_id=user["store_id"], role=user.get("role"),
    )
