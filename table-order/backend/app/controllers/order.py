from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_admin, get_current_user, require_role
from app.exceptions import NotFoundError
from app.models.order import Order
from app.schemas.order import OrderCreate, OrderResponse, OrderStatusUpdate
from app.services import order_service

router = APIRouter()


@router.post("", response_model=OrderResponse)
def create_order(req: OrderCreate, db: Session = Depends(get_db), _user: dict = Depends(get_current_user)):
    items = [{"menu_id": i.menu_id, "quantity": i.quantity} for i in req.items]
    return order_service.create_order(db, req.store_id, req.table_id, req.session_id, items)


@router.get("", response_model=list[OrderResponse])
def list_orders(
    store_id: int = Query(...),
    table_id: int | None = Query(None),
    session_id: int | None = Query(None),
    db: Session = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    q = db.query(Order).filter(Order.store_id == store_id, Order.is_deleted.is_(False))
    if table_id:
        q = q.filter(Order.table_id == table_id)
    if session_id:
        q = q.filter(Order.session_id == session_id)
    return q.order_by(Order.created_at.desc()).all()


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db), _user: dict = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id, Order.is_deleted.is_(False)).first()
    if not order:
        raise NotFoundError("Order not found")
    return order


@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_status(order_id: int, req: OrderStatusUpdate, db: Session = Depends(get_db), _user: dict = Depends(get_current_admin)):
    return order_service.update_order_status(db, order_id, req.status, _user["store_id"])


@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db), _user: dict = Depends(require_role("manager"))):
    order_service.delete_order(db, order_id, _user["store_id"])
    return {"success": True}
