import pytest

from app.exceptions import AppError
from app.models.order import OrderHistory
from app.services.order_service import create_order
from app.services.table_session_service import complete_table


def test_complete_table_success(db, seed_store, seed_table, seed_menu_item):
    create_order(db, seed_store.id, seed_table.id, None, [{"menu_id": seed_menu_item.id, "quantity": 1}])
    db.refresh(seed_table)
    assert seed_table.current_session_id is not None

    complete_table(db, seed_table.id, seed_store.id)
    db.refresh(seed_table)
    assert seed_table.current_session_id is None

    history = db.query(OrderHistory).filter(OrderHistory.table_id == seed_table.id).all()
    assert len(history) == 1


def test_complete_table_no_session(db, seed_store, seed_table):
    with pytest.raises(AppError, match="No active session"):
        complete_table(db, seed_table.id, seed_store.id)
