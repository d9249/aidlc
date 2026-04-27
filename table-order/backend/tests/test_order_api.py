def test_create_order(client, table_token, seed_store, seed_table, seed_menu_item):
    resp = client.post("/api/orders", json={
        "store_id": seed_store.id, "table_id": seed_table.id,
        "items": [{"menu_id": seed_menu_item.id, "quantity": 2}],
    }, headers={"Authorization": f"Bearer {table_token}"})
    assert resp.status_code == 200
    assert resp.json()["total_amount"] == 20000
    assert resp.json()["status"] == "pending"


def test_list_orders(client, table_token, seed_store, seed_table, seed_menu_item):
    client.post("/api/orders", json={
        "store_id": seed_store.id, "table_id": seed_table.id,
        "items": [{"menu_id": seed_menu_item.id, "quantity": 1}],
    }, headers={"Authorization": f"Bearer {table_token}"})
    resp = client.get(f"/api/orders?store_id={seed_store.id}", headers={"Authorization": f"Bearer {table_token}"})
    assert resp.status_code == 200
    assert len(resp.json()) == 1


def test_update_order_status(client, admin_token, table_token, seed_store, seed_table, seed_menu_item):
    create_resp = client.post("/api/orders", json={
        "store_id": seed_store.id, "table_id": seed_table.id,
        "items": [{"menu_id": seed_menu_item.id, "quantity": 1}],
    }, headers={"Authorization": f"Bearer {table_token}"})
    order_id = create_resp.json()["id"]
    resp = client.patch(f"/api/orders/{order_id}/status", json={"status": "preparing"},
                        headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    assert resp.json()["status"] == "preparing"
