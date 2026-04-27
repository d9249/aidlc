import json
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.exceptions import AppError, NotFoundError
from app.models.order import Order, OrderHistory
from app.models.table import Table, TableSession
from app.services.sse_manager import sse_manager


def complete_table(db: Session, table_id: int, store_id: int) -> None:
    tbl = db.query(Table).filter(Table.id == table_id, Table.store_id == store_id).first()
    if not tbl:
        raise NotFoundError("Table not found")

    if not tbl.current_session_id:
        raise AppError("No active session for this table", status_code=400)

    session = db.query(TableSession).filter(
        TableSession.id == tbl.current_session_id, TableSession.is_active.is_(True),
    ).first()
    if not session:
        raise AppError("No active session for this table", status_code=400)

    now = datetime.now(timezone.utc)
    orders = db.query(Order).filter(
        Order.session_id == session.id, Order.is_deleted.is_(False),
    ).all()

    for order in orders:
        items_data = [
            {"menu_name": item.menu_name, "quantity": item.quantity,
             "unit_price": item.unit_price, "subtotal": item.subtotal}
            for item in order.items
        ]
        db.add(OrderHistory(
            store_id=store_id, table_id=tbl.id, table_number=tbl.table_number,
            session_id=session.id, order_id=order.id, order_number=order.order_number,
            order_data=json.dumps(items_data, ensure_ascii=False),
            total_amount=order.total_amount, ordered_at=order.created_at, completed_at=now,
        ))

    session.is_active = False
    session.completed_at = now
    tbl.current_session_id = None
    db.commit()

    sse_manager.broadcast(store_id, "table_completed", {
        "table_id": tbl.id, "table_number": tbl.table_number, "session_id": session.id,
    })
