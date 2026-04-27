from datetime import datetime, timezone

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.exceptions import AppError, NotFoundError
from app.models.menu import MenuItem
from app.models.order import Order, OrderItem
from app.models.table import Table, TableSession
from app.services.sse_manager import sse_manager


def _generate_order_number(db: Session, store_id: int) -> str:
    today = datetime.now(timezone.utc).strftime("%Y%m%d")
    count = db.query(func.count(Order.id)).filter(
        Order.store_id == store_id,
        Order.order_number.like(f"{today}-%"),
    ).scalar() or 0
    return f"{today}-{count + 1:04d}"


def create_order(db: Session, store_id: int, table_id: int, session_id: int | None, items: list[dict]) -> Order:
    tbl = db.query(Table).filter(Table.id == table_id, Table.store_id == store_id).first()
    if not tbl:
        raise NotFoundError("Table not found")

    # Validate menu items
    total = 0
    order_items_data = []
    for item in items:
        menu = db.query(MenuItem).filter(MenuItem.id == item["menu_id"], MenuItem.store_id == store_id).first()
        if not menu:
            raise AppError(f"Menu item {item['menu_id']} not found", status_code=400)
        if not menu.is_available:
            raise AppError(f"Menu item '{menu.name}' is not available", status_code=400)
        subtotal = menu.price * item["quantity"]
        total += subtotal
        order_items_data.append({"menu": menu, "quantity": item["quantity"], "subtotal": subtotal})

    # Session handling: auto-start on first order
    if tbl.current_session_id:
        session = db.query(TableSession).filter(TableSession.id == tbl.current_session_id, TableSession.is_active.is_(True)).first()
        if not session:
            session = _create_session(db, tbl)
    else:
        session = _create_session(db, tbl)

    order = Order(
        store_id=store_id, table_id=table_id, session_id=session.id,
        order_number=_generate_order_number(db, store_id),
        status="pending", total_amount=total,
    )
    db.add(order)
    db.flush()

    for data in order_items_data:
        db.add(OrderItem(
            order_id=order.id, menu_item_id=data["menu"].id,
            menu_name=data["menu"].name, quantity=data["quantity"],
            unit_price=data["menu"].price, subtotal=data["subtotal"],
        ))

    session.total_amount += total
    db.commit()
    db.refresh(order)

    sse_manager.broadcast(store_id, "new_order", {
        "order_id": order.id, "table_id": table_id,
        "table_number": tbl.table_number, "total_amount": total,
        "order_number": order.order_number,
    })
    return order


def _create_session(db: Session, tbl: Table) -> TableSession:
    session = TableSession(table_id=tbl.id, store_id=tbl.store_id)
    db.add(session)
    db.flush()
    tbl.current_session_id = session.id
    return session


def update_order_status(db: Session, order_id: int, new_status: str, store_id: int) -> Order:
    order = db.query(Order).filter(Order.id == order_id, Order.store_id == store_id, Order.is_deleted.is_(False)).first()
    if not order:
        raise NotFoundError("Order not found")
    if order.status == "completed":
        raise AppError("Cannot change status of completed order", status_code=400)

    old_status = order.status
    order.status = new_status
    db.commit()
    db.refresh(order)

    sse_manager.broadcast(store_id, "order_status_changed", {
        "order_id": order.id, "table_id": order.table_id,
        "old_status": old_status, "new_status": new_status,
    })
    return order


def delete_order(db: Session, order_id: int, store_id: int) -> None:
    order = db.query(Order).filter(Order.id == order_id, Order.store_id == store_id, Order.is_deleted.is_(False)).first()
    if not order:
        raise NotFoundError("Order not found")

    order.is_deleted = True
    session = db.query(TableSession).filter(TableSession.id == order.session_id).first()
    if session:
        session.total_amount = max(0, session.total_amount - order.total_amount)
    db.commit()

    sse_manager.broadcast(store_id, "order_deleted", {
        "order_id": order.id, "table_id": order.table_id,
        "amount_change": -order.total_amount,
    })
