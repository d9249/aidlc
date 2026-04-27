import asyncio

from fastapi import APIRouter, Depends, Query
from sse_starlette.sse import EventSourceResponse

from app.dependencies import get_current_admin
from app.services.sse_manager import sse_manager

router = APIRouter()


@router.get("/orders")
async def order_stream(store_id: int = Query(...), _user: dict = Depends(get_current_admin)):
    queue = sse_manager.subscribe(store_id)

    async def event_generator():
        try:
            while True:
                try:
                    message = await asyncio.wait_for(queue.get(), timeout=30.0)
                    yield {"data": message}
                except asyncio.TimeoutError:
                    yield {"event": "ping", "data": ""}
        except asyncio.CancelledError:
            pass
        finally:
            sse_manager.unsubscribe(store_id, queue)

    return EventSourceResponse(event_generator())
