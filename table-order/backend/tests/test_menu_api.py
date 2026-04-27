def test_list_categories(client, seed_category, seed_store):
    resp = client.get(f"/api/categories?store_id={seed_store.id}")
    assert resp.status_code == 200
    assert len(resp.json()) == 1


def test_create_menu(client, admin_token, seed_category):
    resp = client.post("/api/menus", json={
        "name": "Pizza", "price": 15000, "category_id": seed_category.id,
    }, headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    assert resp.json()["name"] == "Pizza"


def test_list_menus(client, seed_menu_item, seed_store):
    resp = client.get(f"/api/menus?store_id={seed_store.id}")
    assert resp.status_code == 200
    assert len(resp.json()) == 1


def test_update_menu(client, admin_token, seed_menu_item):
    resp = client.put(f"/api/menus/{seed_menu_item.id}", json={"price": 12000},
                      headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    assert resp.json()["price"] == 12000


def test_delete_menu(client, admin_token, seed_menu_item):
    resp = client.delete(f"/api/menus/{seed_menu_item.id}",
                         headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
