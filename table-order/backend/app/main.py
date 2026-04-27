from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.controllers import auth, menu, order, sse, table
from app.exceptions import register_exception_handlers
from app.middleware.logging_middleware import LoggingMiddleware
from app.middleware.request_id import RequestIDMiddleware

app = FastAPI(
    title="Table Order API",
    description="테이블오더 서비스 API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CORS_ORIGINS] if settings.CORS_ORIGINS != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(LoggingMiddleware)
app.add_middleware(RequestIDMiddleware)

register_exception_handlers(app)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(menu.router, prefix="/api", tags=["Menu"])
app.include_router(order.router, prefix="/api/orders", tags=["Order"])
app.include_router(table.router, prefix="/api/tables", tags=["Table"])
app.include_router(sse.router, prefix="/api/sse", tags=["SSE"])


@app.get("/health")
def health_check():
    return {"status": "ok"}
