"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchTables, completeTable } from "@/actions/table";
import { fetchOrders, updateOrderStatus, deleteOrder } from "@/actions/order";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { Order, TableInfo } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const { state: auth, dispatch } = useAuth();
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [ordersByTable, setOrdersByTable] = useState<Record<number, Order[]>>({});
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null);
  const [confirm, setConfirm] = useState<{ title: string; message: string; action: () => void } | null>(null);
  const [highlight, setHighlight] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!auth.token || !auth.storeId) return;
    const [tbls, orders] = await Promise.all([fetchTables(auth.token, auth.storeId), fetchOrders(auth.token, auth.storeId)]);
    setTables(tbls);
    const grouped: Record<number, Order[]> = {};
    orders.forEach((o) => { (grouped[o.table_id] ??= []).push(o); });
    setOrdersByTable(grouped);
    setLoading(false);
  }, [auth.token, auth.storeId]);

  useEffect(() => {
    if (!auth.token) { router.push("/admin/login"); return; }
    loadData();
  }, [auth.token, router, loadData]);

  // SSE
  useEffect(() => {
    if (!auth.token || !auth.storeId) return;
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const es = new EventSource(`${API_BASE}/api/sse/orders?store_id=${auth.storeId}&token=${auth.token}`);
    es.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.event === "new_order" && msg.data?.table_id) {
        setHighlight((prev) => new Set(prev).add(msg.data.table_id));
        setTimeout(() => setHighlight((prev) => { const n = new Set(prev); n.delete(msg.data.table_id); return n; }), 2000);
      }
      loadData();
    };
    return () => es.close();
  }, [auth.token, auth.storeId, loadData]);

  async function handleStatusChange(orderId: number, status: string) {
    if (!auth.token) return;
    await updateOrderStatus(auth.token, orderId, status);
    loadData();
  }

  async function handleDelete(orderId: number) {
    if (!auth.token) return;
    setConfirm({ title: "주문 삭제", message: "이 주문을 삭제하시겠습니까?", action: async () => { await deleteOrder(auth.token!, orderId); setConfirm(null); loadData(); } });
  }

  async function handleComplete(tableId: number) {
    if (!auth.token) return;
    setConfirm({ title: "이용 완료", message: "이 테이블의 이용을 완료하시겠습니까?", action: async () => { await completeTable(auth.token!, tableId); setConfirm(null); setSelectedTable(null); loadData(); } });
  }

  if (loading) return <LoadingSpinner />;

  const tableOrders = selectedTable ? (ordersByTable[selectedTable.id] ?? []) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex h-14 items-center justify-between border-b bg-white px-6">
        <span className="font-bold">{auth.storeName} — 관리자</span>
        <div className="flex gap-4">
          <Link href="/admin/dashboard" className="text-sm font-semibold text-indigo-600" data-testid="nav-dashboard">대시보드</Link>
          {auth.role === "manager" && <Link href="/admin/menus" className="text-sm text-gray-600 hover:text-black" data-testid="nav-menus">메뉴관리</Link>}
          <button data-testid="admin-logout" onClick={() => { dispatch({ type: "LOGOUT" }); router.push("/admin/login"); }} className="text-sm text-red-600">로그아웃</button>
        </div>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {tables.map((t) => {
            const orders = ordersByTable[t.id] ?? [];
            const total = orders.reduce((s, o) => s + o.total_amount, 0);
            return (
              <div key={t.id} onClick={() => setSelectedTable(t)} className={`cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition ${highlight.has(t.id) ? "ring-2 ring-blue-500 animate-pulse" : "hover:shadow-md"}`} data-testid={`table-card-${t.id}`}>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">테이블 {t.table_number}</span>
                  {t.current_session_id && <span className="h-2 w-2 rounded-full bg-green-500" />}
                </div>
                <p className="mt-1 text-sm text-gray-500">{orders.length}건</p>
                <p className="mt-1 font-bold text-blue-600">{total.toLocaleString()}원</p>
                {orders.slice(0, 2).map((o) => (
                  <div key={o.id} className="mt-1 flex items-center justify-between text-xs text-gray-400">
                    <span>{o.order_number}</span><StatusBadge status={o.status} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </main>

      {/* Order Detail Modal */}
      {selectedTable && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40" data-testid="order-detail-modal">
          <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">테이블 {selectedTable.table_number}</h2>
              <button onClick={() => setSelectedTable(null)} className="text-gray-400 hover:text-black" data-testid="modal-close">✕</button>
            </div>
            {tableOrders.length === 0 ? <p className="mt-4 text-gray-500">주문이 없습니다.</p> : tableOrders.map((order) => (
              <div key={order.id} className="mt-4 rounded-lg border p-3" data-testid={`modal-order-${order.id}`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">{order.order_number}</span>
                  <StatusBadge status={order.status} />
                </div>
                <ul className="mt-2">{order.items.map((item) => <li key={item.id} className="flex justify-between text-sm"><span>{item.menu_name} × {item.quantity}</span><span>{item.subtotal.toLocaleString()}원</span></li>)}</ul>
                <p className="mt-1 text-right font-bold">{order.total_amount.toLocaleString()}원</p>
                <div className="mt-2 flex gap-2">
                  {order.status !== "completed" && (
                    <>
                      {order.status === "pending" && <button data-testid={`status-preparing-${order.id}`} onClick={() => handleStatusChange(order.id, "preparing")} className="rounded bg-blue-100 px-3 py-1 text-xs text-blue-700">준비중</button>}
                      {order.status === "preparing" && <button data-testid={`status-pending-${order.id}`} onClick={() => handleStatusChange(order.id, "pending")} className="rounded bg-yellow-100 px-3 py-1 text-xs text-yellow-700">대기중</button>}
                      <button data-testid={`status-completed-${order.id}`} onClick={() => handleStatusChange(order.id, "completed")} className="rounded bg-green-100 px-3 py-1 text-xs text-green-700">완료</button>
                    </>
                  )}
                  {auth.role === "manager" && <button data-testid={`delete-order-${order.id}`} onClick={() => handleDelete(order.id)} className="rounded bg-red-100 px-3 py-1 text-xs text-red-700">삭제</button>}
                </div>
              </div>
            ))}
            {auth.role === "manager" && selectedTable.current_session_id && (
              <button data-testid="complete-table" onClick={() => handleComplete(selectedTable.id)} className="mt-4 w-full rounded-lg bg-orange-600 py-2 text-white font-semibold">이용 완료</button>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog title={confirm?.title ?? ""} message={confirm?.message ?? ""} isOpen={!!confirm} onConfirm={() => confirm?.action()} onCancel={() => setConfirm(null)} />
    </div>
  );
}
