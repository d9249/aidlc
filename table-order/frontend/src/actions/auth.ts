"use server";
import { apiFetch } from "@/lib/api";
import type { TokenResponse } from "@/lib/types";

export async function loginAdmin(storeIdentifier: string, username: string, password: string): Promise<TokenResponse> {
  return apiFetch<TokenResponse>("/api/auth/admin/login", {
    method: "POST",
    body: JSON.stringify({ store_identifier: storeIdentifier, username, password }),
  });
}

export async function loginTable(storeIdentifier: string, tableNumber: number, password: string): Promise<TokenResponse> {
  return apiFetch<TokenResponse>("/api/auth/table/login", {
    method: "POST",
    body: JSON.stringify({ store_identifier: storeIdentifier, table_number: tableNumber, password }),
  });
}
