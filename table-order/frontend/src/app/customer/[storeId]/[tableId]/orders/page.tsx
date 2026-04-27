"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchOrders } from "@/actions/order";
import StatusBadge from "@/components/StatusBadge";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { Order } from "@/lib/types";

export default function OrderHistoryPage() {
  const { storeId, tableId } = useParams<{ storeId: string; tableId: string }>();
  const { state: auth } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.token || !auth.sessionId) { setLoading(false); return; }
    fetchOrders(auth.token, Number(storeId), Number(tableId), auth.sessionId).then((data) => { setOrders(data); setLoading(false); });
  }, [auth.token, auth.sessionId, storeId, tableId]);

  if (loading) return <LoadingSpinner />;

  return (
    <main className="flex-1 p-4">
      <h1 className="mb-4 text-xl font-bold">주문 내역</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">주문 내역이 없습니다.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="mb-3 rounded-lg border bg-white p-4" data-testid={`order-${order.id}`}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">{order.order_number}</span>
              <StatusBadge status={order.status} />
            </div>
            <p className="mt-1 text-xs text-gray-400">{new Date(order.created_at).toLocaleString("ko-KR")}</p>
            <ul className="mt-2">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span>{item.menu_name} × {item.quantity}</span>
                  <span>{item.subtotal.toLocaleString()}원</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-right font-bold">{order.total_amount.toLocaleString()}원</p>
          </div>
        ))
      )}
    </main>
  );
}
