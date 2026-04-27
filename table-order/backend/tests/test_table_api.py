def test_create_table(client, admin_token, seed_store):
    resp = client.post("/api/tables", json={
        "store_id": seed_store.id, "table_number": 5, "password": "pass",
    }, headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    assert resp.json()["table_number"] == 5


def test_list_tables(client, admin_token, seed_store, seed_table):
    resp = client.get(f"/api/tables?store_id={seed_store.id}",
                      headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    assert len(resp.json()) == 1
