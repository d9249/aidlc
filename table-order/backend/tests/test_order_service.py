import pytest

from app.exceptions import AppError, NotFoundError
from app.services.order_service import create_order, delete_order, update_order_status


def test_create_order_success(db, seed_store, seed_table, seed_menu_item):
    order = create_order(db, seed_store.id, seed_table.id, None, [{"menu_id": seed_menu_item.id, "quantity": 2}])
    assert order.total_amount == 20000
    assert order.status == "pending"
    assert len(order.items) == 1
    assert order.items[0].quantity == 2


def test_create_order_invalid_menu(db, seed_store, seed_table):
    with pytest.raises(AppError, match="not found"):
        create_order(db, seed_store.id, seed_table.id, None, [{"menu_id": 9999, "quantity": 1}])


def test_create_order_auto_session(db, seed_store, seed_table, seed_menu_item):
    assert seed_table.current_session_id is None
    order = create_order(db, seed_store.id, seed_table.id, None, [{"menu_id": seed_menu_item.id, "quantity": 1}])
    db.refresh(seed_table)
    assert seed_table.current_session_id is not None
    assert order.session_id == seed_table.current_session_id


def test_update_order_status(db, seed_store, seed_table, seed_menu_item):
    order = create_order(db, seed_store.id, seed_table.id, None, [{"menu_id": seed_menu_item.id, "quantity": 1}])
    updated = update_order_status(db, order.id, "preparing", seed_store.id)
    assert updated.status == "preparing"


def test_update_completed_order_fails(db, seed_store, seed_table, seed_menu_item):
    order = create_order(db, seed_store.id, seed_table.id, None, [{"menu_id": seed_menu_item.id, "quantity": 1}])
    update_order_status(db, order.id, "completed", seed_store.id)
    with pytest.raises(AppError, match="completed"):
        update_order_status(db, order.id, "pending", seed_store.id)


def test_soft_delete_order(db, seed_store, seed_table, seed_menu_item):
    order = create_order(db, seed_store.id, seed_table.id, None, [{"menu_id": seed_menu_item.id, "quantity": 1}])
    delete_order(db, order.id, seed_store.id)
    db.refresh(order)
    assert order.is_deleted is True
