"""메뉴 이미지 URL 업데이트 스크립트"""
from app.database import SessionLocal
from app.models.menu import MenuItem

IMAGES = {
    "불고기버거": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    "치즈버거": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
    "치킨텐더": "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop",
    "감자튀김": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
    "콜라": "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop",
    "사이다": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=300&fit=crop",
    "아메리카노": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
}

db = SessionLocal()
for menu in db.query(MenuItem).all():
    if menu.name in IMAGES:
        menu.image_url = IMAGES[menu.name]
db.commit()
db.close()
print("메뉴 이미지 URL 업데이트 완료!")
