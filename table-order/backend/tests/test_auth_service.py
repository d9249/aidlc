from app.services.auth_service import create_token, decode_token, hash_password, verify_password


def test_hash_and_verify_password():
    hashed = hash_password("secret")
    assert verify_password("secret", hashed)
    assert not verify_password("wrong", hashed)


def test_create_and_decode_token():
    token = create_token({"sub": "1", "user_type": "admin", "store_id": 1, "role": "manager"})
    payload = decode_token(token)
    assert payload["sub"] == "1"
    assert payload["user_type"] == "admin"
    assert payload["store_id"] == 1
    assert payload["role"] == "manager"
