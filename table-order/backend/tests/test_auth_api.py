def test_admin_login_success(client, seed_admin, seed_store):
    resp = client.post("/api/auth/admin/login", json={
        "store_identifier": seed_store.store_identifier, "username": "manager1", "password": "pass123",
    })
    assert resp.status_code == 200
    assert "access_token" in resp.json()
    assert resp.json()["role"] == "manager"


def test_admin_login_wrong_password(client, seed_admin, seed_store):
    resp = client.post("/api/auth/admin/login", json={
        "store_identifier": seed_store.store_identifier, "username": "manager1", "password": "wrong",
    })
    assert resp.status_code == 401


def test_table_login_success(client, seed_table, seed_store):
    resp = client.post("/api/auth/table/login", json={
        "store_identifier": seed_store.store_identifier, "table_number": 1, "password": "table123",
    })
    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_get_me(client, admin_token):
    resp = client.get("/api/auth/me", headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    assert resp.json()["user_type"] == "admin"
