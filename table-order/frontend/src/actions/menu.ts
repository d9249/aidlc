"use server";
import { apiFetch } from "@/lib/api";
import type { Category, MenuItem } from "@/lib/types";

export async function fetchCategories(storeId: number): Promise<Category[]> {
  return apiFetch<Category[]>(`/api/categories?store_id=${storeId}`);
}

export async function fetchMenus(storeId: number, categoryId?: number): Promise<MenuItem[]> {
  const params = categoryId ? `&category_id=${categoryId}` : "";
  return apiFetch<MenuItem[]>(`/api/menus?store_id=${storeId}${params}`);
}

export async function createMenu(token: string, data: { name: string; price: number; description?: string; category_id: number; image_url?: string }): Promise<MenuItem> {
  return apiFetch<MenuItem>("/api/menus", { method: "POST", body: JSON.stringify(data), token });
}

export async function updateMenu(token: string, menuId: number, data: Record<string, unknown>): Promise<MenuItem> {
  return apiFetch<MenuItem>(`/api/menus/${menuId}`, { method: "PUT", body: JSON.stringify(data), token });
}

export async function deleteMenu(token: string, menuId: number): Promise<void> {
  await apiFetch(`/api/menus/${menuId}`, { method: "DELETE", token });
}
