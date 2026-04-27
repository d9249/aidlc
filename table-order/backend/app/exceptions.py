import traceback

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.config import settings


class AppError(Exception):
    def __init__(self, detail: str, status_code: int = 400, error_code: str = "BAD_REQUEST"):
        self.detail = detail
        self.status_code = status_code
        self.error_code = error_code


class AuthError(AppError):
    def __init__(self, detail: str = "Authentication failed"):
        super().__init__(detail, status_code=401, error_code="AUTH_ERROR")


class ForbiddenError(AppError):
    def __init__(self, detail: str = "Access denied"):
        super().__init__(detail, status_code=403, error_code="FORBIDDEN")


class NotFoundError(AppError):
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(detail, status_code=404, error_code="NOT_FOUND")


class LockedError(AppError):
    def __init__(self, detail: str = "Account locked"):
        super().__init__(detail, status_code=423, error_code="LOCKED")


def register_exception_handlers(app: FastAPI):
    @app.exception_handler(AppError)
    async def app_error_handler(_request: Request, exc: AppError):
        body = {"detail": exc.detail, "error_code": exc.error_code}
        if settings.DEBUG:
            body["stack_trace"] = traceback.format_exc()
        return JSONResponse(status_code=exc.status_code, content=body)

    @app.exception_handler(Exception)
    async def generic_error_handler(_request: Request, exc: Exception):
        body = {"detail": "Internal server error", "error_code": "INTERNAL_ERROR"}
        if settings.DEBUG:
            body["stack_trace"] = traceback.format_exc()
        return JSONResponse(status_code=500, content=body)
