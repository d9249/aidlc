"""초기 시드 데이터 생성 스크립트

사용법: cd backend && source venv/bin/activate && python seed.py
"""
from app.database import Base, engine, SessionLocal
from app.models import Admin, Category, MenuItem, Store, Table
from app.services.auth_service import hash_password


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 매장
    store = db.query(Store).filter(Store.store_identifier == "mystore").first()
    if not store:
        store = Store(name="우리매장", store_identifier="mystore")
        db.add(store)
        db.flush()

    # 관리자 (매니저)
    if not db.query(Admin).filter(Admin.store_id == store.id, Admin.username == "admin").first():
        db.add(Admin(store_id=store.id, username="admin", password_hash=hash_password("1234"), role="manager"))

    # 관리자 (직원)
    if not db.query(Admin).filter(Admin.store_id == store.id, Admin.username == "staff1").first():
        db.add(Admin(store_id=store.id, username="staff1", password_hash=hash_password("1234"), role="staff"))

    # 테이블 1~5
    for n in range(1, 6):
        if not db.query(Table).filter(Table.store_id == store.id, Table.table_number == n).first():
            db.add(Table(store_id=store.id, table_number=n, password_hash=hash_password("0000")))

    # 카테고리
    cat_names = ["메인", "사이드", "음료"]
    cats = {}
    for i, name in enumerate(cat_names):
        cat = db.query(Category).filter(Category.store_id == store.id, Category.name == name).first()
        if not cat:
            cat = Category(store_id=store.id, name=name, sort_order=i)
            db.add(cat)
            db.flush()
        cats[name] = cat

    # 메뉴
    menus = [
        ("불고기버거", 8900, "메인", "육즙 가득한 불고기 패티"),
        ("치즈버거", 7900, "메인", "고소한 체다치즈"),
        ("치킨텐더", 6900, "사이드", "바삭한 치킨텐더 5조각"),
        ("감자튀김", 3900, "사이드", "바삭한 감자튀김"),
        ("콜라", 2500, "음료", None),
        ("사이다", 2500, "음료", None),
        ("아메리카노", 3500, "음료", "원두커피"),
    ]
    for name, price, cat_name, desc in menus:
        if not db.query(MenuItem).filter(MenuItem.store_id == store.id, MenuItem.name == name).first():
            db.add(MenuItem(store_id=store.id, category_id=cats[cat_name].id, name=name, price=price, description=desc))

    db.commit()
    db.close()
    print("시드 데이터 생성 완료!")
    print()
    print("=== 로그인 정보 ===")
    print("매장 식별자: mystore")
    print()
    print("[관리자 - 매니저]")
    print("  사용자명: admin / 비밀번호: 1234")
    print("[관리자 - 직원]")
    print("  사용자명: staff1 / 비밀번호: 1234")
    print()
    print("[테이블 1~5]")
    print("  테이블 번호: 1~5 / 비밀번호: 0000")


if __name__ == "__main__":
    seed()
