import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app
from app.models import *  # noqa: F401,F403
from app.services.auth_service import create_token, hash_password

TEST_DB_URL = "sqlite://"

engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool)
TestSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def db():
    Base.metadata.create_all(bind=engine)
    session = TestSession()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client(db):
    def _override():
        try:
            yield db
        finally:
            pass
    app.dependency_overrides[get_db] = _override
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def seed_store(db):
    from app.models.store import Store
    store = Store(name="Test Store", store_identifier="test-store")
    db.add(store)
    db.commit()
    db.refresh(store)
    return store


@pytest.fixture
def seed_admin(db, seed_store):
    from app.models.admin import Admin
    admin = Admin(store_id=seed_store.id, username="manager1", password_hash=hash_password("pass123"), role="manager")
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin


@pytest.fixture
def seed_table(db, seed_store):
    from app.models.table import Table
    tbl = Table(store_id=seed_store.id, table_number=1, password_hash=hash_password("table123"))
    db.add(tbl)
    db.commit()
    db.refresh(tbl)
    return tbl


@pytest.fixture
def seed_category(db, seed_store):
    from app.models.menu import Category
    cat = Category(store_id=seed_store.id, name="Main", sort_order=0)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@pytest.fixture
def seed_menu_item(db, seed_store, seed_category):
    from app.models.menu import MenuItem
    item = MenuItem(store_id=seed_store.id, category_id=seed_category.id, name="Burger", price=10000)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@pytest.fixture
def admin_token(seed_admin, seed_store):
    return create_token({"sub": str(seed_admin.id), "user_type": "admin", "store_id": seed_store.id, "role": "manager"})


@pytest.fixture
def table_token(seed_table, seed_store):
    return create_token({"sub": str(seed_table.id), "user_type": "table", "store_id": seed_store.id})
