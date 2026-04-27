"use server";
import { apiFetch } from "@/lib/api";
import type { Order } from "@/lib/types";

export async function createOrder(token: string, data: { store_id: number; table_id: number; session_id?: number; items: { menu_id: number; quantity: number }[] }): Promise<Order> {
  return apiFetch<Order>("/api/orders", { method: "POST", body: JSON.stringify(data), token });
}

export async function fetchOrders(token: string, storeId: number, tableId?: number, sessionId?: number): Promise<Order[]> {
  let url = `/api/orders?store_id=${storeId}`;
  if (tableId) url += `&table_id=${tableId}`;
  if (sessionId) url += `&session_id=${sessionId}`;
  return apiFetch<Order[]>(url, { token });
}

export async function updateOrderStatus(token: string, orderId: number, status: string): Promise<Order> {
  return apiFetch<Order>(`/api/orders/${orderId}/status`, { method: "PATCH", body: JSON.stringify({ status }), token });
}

export async function deleteOrder(token: string, orderId: number): Promise<void> {
  await apiFetch(`/api/orders/${orderId}`, { method: "DELETE", token });
}
