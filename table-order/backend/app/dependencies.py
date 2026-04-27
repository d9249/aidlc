from fastapi import Depends, Header

from app.exceptions import AuthError, ForbiddenError
from app.services.auth_service import decode_token


def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise AuthError("Invalid authorization header")
    token = authorization[7:]
    return decode_token(token)


def get_current_admin(user: dict = Depends(get_current_user)):
    if user.get("user_type") != "admin":
        raise ForbiddenError("Admin access required")
    return user


def get_current_table(user: dict = Depends(get_current_user)):
    if user.get("user_type") != "table":
        raise ForbiddenError("Table access required")
    return user


def require_role(role: str):
    def _check(user: dict = Depends(get_current_admin)):
        if user.get("role") != role:
            raise ForbiddenError(f"Role '{role}' required")
        return user
    return _check
