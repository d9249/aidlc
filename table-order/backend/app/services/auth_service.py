from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.config import settings
from app.exceptions import AuthError, LockedError
from app.models.admin import Admin
from app.models.store import Store
from app.models.table import Table

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=settings.BCRYPT_ROUNDS)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_token(data: dict) -> str:
    to_encode = data.copy()
    to_encode["exp"] = datetime.now(timezone.utc) + timedelta(hours=settings.JWT_EXPIRE_HOURS)
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except JWTError as e:
        raise AuthError("Invalid or expired token") from e


def login_admin(db: Session, store_identifier: str, username: str, password: str) -> dict:
    store = db.query(Store).filter(Store.store_identifier == store_identifier).first()
    if not store:
        raise AuthError("Invalid credentials")

    admin = db.query(Admin).filter(Admin.store_id == store.id, Admin.username == username).first()
    if not admin:
        raise AuthError("Invalid credentials")

    now = datetime.now(timezone.utc)
    if admin.locked_until and admin.locked_until.replace(tzinfo=timezone.utc) > now:
        remaining = int((admin.locked_until.replace(tzinfo=timezone.utc) - now).total_seconds())
        raise LockedError(f"Account locked. Try again in {remaining} seconds.")

    if not verify_password(password, admin.password_hash):
        admin.failed_login_attempts += 1
        if admin.failed_login_attempts >= settings.LOGIN_MAX_ATTEMPTS:
            admin.locked_until = now + timedelta(minutes=settings.LOGIN_LOCKOUT_MINUTES)
        db.commit()
        raise AuthError("Invalid credentials")

    admin.failed_login_attempts = 0
    admin.locked_until = None
    db.commit()

    token = create_token({"sub": str(admin.id), "user_type": "admin", "store_id": store.id, "role": admin.role})
    return {"access_token": token, "role": admin.role, "store_id": store.id, "store_name": store.name}


def login_table(db: Session, store_identifier: str, table_number: int, password: str) -> dict:
    store = db.query(Store).filter(Store.store_identifier == store_identifier).first()
    if not store:
        raise AuthError("Invalid credentials")

    tbl = db.query(Table).filter(Table.store_id == store.id, Table.table_number == table_number).first()
    if not tbl:
        raise AuthError("Invalid credentials")

    if not verify_password(password, tbl.password_hash):
        raise AuthError("Invalid credentials")

    token = create_token({"sub": str(tbl.id), "user_type": "table", "store_id": store.id})
    return {
        "access_token": token,
        "table_id": tbl.id,
        "session_id": tbl.current_session_id,
        "store_id": store.id,
        "store_name": store.name,
    }
