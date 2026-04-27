from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_admin, require_role
from app.exceptions import NotFoundError
from app.models.order import OrderHistory
from app.models.table import Table
from app.schemas.order import OrderHistoryResponse
from app.schemas.table import TableCreate, TableResponse
from app.services import table_session_service
from app.services.auth_service import hash_password

router = APIRouter()


@router.post("", response_model=TableResponse)
def create_table(req: TableCreate, db: Session = Depends(get_db), _user: dict = Depends(get_current_admin)):
    tbl = Table(store_id=req.store_id, table_number=req.table_number, password_hash=hash_password(req.password))
    db.add(tbl)
    db.commit()
    db.refresh(tbl)
    return tbl


@router.get("", response_model=list[TableResponse])
def list_tables(store_id: int = Query(...), db: Session = Depends(get_db), _user: dict = Depends(get_current_admin)):
    return db.query(Table).filter(Table.store_id == store_id).order_by(Table.table_number).all()


@router.post("/{table_id}/complete")
def complete_table(table_id: int, db: Session = Depends(get_db), _user: dict = Depends(require_role("manager"))):
    table_session_service.complete_table(db, table_id, _user["store_id"])
    return {"success": True}


@router.get("/{table_id}/history", response_model=list[OrderHistoryResponse])
def get_table_history(
    table_id: int,
    date: str | None = Query(None),
    db: Session = Depends(get_db),
    _user: dict = Depends(get_current_admin),
):
    q = db.query(OrderHistory).filter(OrderHistory.table_id == table_id, OrderHistory.store_id == _user["store_id"])
    if date:
        q = q.filter(OrderHistory.completed_at >= date)
    return q.order_by(OrderHistory.completed_at.desc()).all()
