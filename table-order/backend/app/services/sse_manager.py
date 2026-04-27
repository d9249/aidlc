import asyncio
import json
from collections import defaultdict


class SSEManager:
    def __init__(self):
        self._subscribers: dict[int, list[asyncio.Queue]] = defaultdict(list)

    def subscribe(self, store_id: int) -> asyncio.Queue:
        queue: asyncio.Queue = asyncio.Queue()
        self._subscribers[store_id].append(queue)
        return queue

    def unsubscribe(self, store_id: int, queue: asyncio.Queue) -> None:
        if store_id in self._subscribers:
            try:
                self._subscribers[store_id].remove(queue)
            except ValueError:
                pass

    def broadcast(self, store_id: int, event_type: str, data: dict) -> None:
        message = json.dumps({"event": event_type, "data": data}, ensure_ascii=False)
        for queue in self._subscribers.get(store_id, []):
            try:
                queue.put_nowait(message)
            except asyncio.QueueFull:
                pass


sse_manager = SSEManager()
