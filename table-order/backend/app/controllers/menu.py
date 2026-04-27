from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_admin
from app.exceptions import AppError, NotFoundError
from app.models.menu import Category, MenuItem
from app.schemas.menu import (
    CategoryCreate, CategoryResponse, CategoryUpdate,
    MenuItemCreate, MenuItemResponse, MenuItemUpdate, MenuReorderRequest,
)

router = APIRouter()


# --- Categories ---

@router.get("/categories", response_model=list[CategoryResponse])
def list_categories(store_id: int = Query(...), db: Session = Depends(get_db)):
    return db.query(Category).filter(Category.store_id == store_id).order_by(Category.sort_order).all()


@router.post("/categories", response_model=CategoryResponse)
def create_category(req: CategoryCreate, db: Session = Depends(get_db), _user: dict = Depends(get_current_admin)):
    cat = Category(store_id=_user["store_id"], name=req.name, sort_order=req.sort_order)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.put("/categories/{category_id}", response_model=CategoryResponse)
def update_category(category_id: int, req: CategoryUpdate, db: Session = Depends(get_db), _user: dict = Depends(get_current_admin)):
    cat = db.query(Category).filter(Category.id == category_id, Category.store_id == _user["store_id"]).first()
    if not cat:
        raise NotFoundError("Category not found")
    if req.name is not None:
        cat.name = req.name
    if req.sort_order is not None:
        cat.sort_order = req.sort_order
    db.commit()
    db.refresh(cat)
    return cat


@router.delete("/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db), _user: dict = Depends(get_current_admin)):
    cat = db.query(Category).filter(Category.id == category_id, Category.store_id == _user["store_id"]).first()
    if not cat:
        raise NotFoundError("Category not found")
    if db.query(MenuItem).filter(MenuItem.category_id == category_id).count() > 0:
        raise AppError("Cannot delete category with menu items", status_code=400)
    db.delete(cat)
    db.commit()
    return {"success": True}


# --- Menu Items ---

@router.get("/menus", response_model=list[MenuItemResponse])
def list_menus(store_id: int = Query(...), category_id: int | None = Query(None), db: Session = Depends(get_db)):
    q = db.query(MenuItem).filter(MenuItem.store_id == store_id)
    if category_id:
        q = q.filter(MenuItem.category_id == category_id)
    return q.order_by(MenuItem.sort_order).all()


@router.get("/menus/{menu_id}", response_model=MenuItemResponse)
def get_menu(menu_id: int, db: Session = Depends(get_db)):
    menu = db.query(MenuItem).filter(MenuItem.id == menu_id).first()
    if not menu:
        raise NotFoundError("Menu item not found")
    return menu


@router.post("/menus", response_model=MenuItemResponse)
def create_menu(req: MenuItemCreate, db: Session = Depends(get_db), _user: dict = Depends(get_current_admin)):
    menu = MenuItem(store_id=_user["store_id"], **req.model_dump())
    db.add(menu)
    db.commit()
    db.refresh(menu)
    return menu


@router.put("/menus/{menu_id}", response_model=MenuItemResponse)
def update_menu(menu_id: int, req: MenuItemUpdate, db: Session = Depends(get_db), _user: dict = Depends(get_current_admin)):
    menu = db.query(MenuItem).filter(MenuItem.id == menu_id, MenuItem.store_id == _user["store_id"]).first()
    if not menu:
        raise NotFoundError("Menu item not found")
    for field, value in req.model_dump(exclude_unset=True).items():
        setattr(menu, field, value)
    db.commit()
    db.refresh(menu)
    return menu


@router.delete("/menus/{menu_id}")
def delete_menu(menu_id: int, db: Session = Depends(get_db), _user: dict = Depends(get_current_admin)):
    menu = db.query(MenuItem).filter(MenuItem.id == menu_id, MenuItem.store_id == _user["store_id"]).first()
    if not menu:
        raise NotFoundError("Menu item not found")
    db.delete(menu)
    db.commit()
    return {"success": True}


@router.put("/menus/reorder")
def reorder_menus(req: MenuReorderRequest, db: Session = Depends(get_db), _user: dict = Depends(get_current_admin)):
    for idx, menu_id in enumerate(req.menu_ids):
        menu = db.query(MenuItem).filter(MenuItem.id == menu_id, MenuItem.store_id == _user["store_id"]).first()
        if menu:
            menu.sort_order = idx
    db.commit()
    return {"success": True}
