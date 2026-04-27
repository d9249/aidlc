"use server";
import { apiFetch } from "@/lib/api";
import type { OrderHistory, TableInfo } from "@/lib/types";

export async function fetchTables(token: string, storeId: number): Promise<TableInfo[]> {
  return apiFetch<TableInfo[]>(`/api/tables?store_id=${storeId}`, { token });
}

export async function completeTable(token: string, tableId: number): Promise<void> {
  await apiFetch(`/api/tables/${tableId}/complete`, { method: "POST", token });
}

export async function fetchTableHistory(token: string, tableId: number, date?: string): Promise<OrderHistory[]> {
  let url = `/api/tables/${tableId}/history`;
  if (date) url += `?date=${date}`;
  return apiFetch<OrderHistory[]>(url, { token });
}
