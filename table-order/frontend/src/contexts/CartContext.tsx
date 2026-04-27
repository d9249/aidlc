"use client";
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
import type { CartItem } from "@/lib/types";

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { menuId: number } }
  | { type: "UPDATE_QUANTITY"; payload: { menuId: number; quantity: number } }
  | { type: "CLEAR_CART" };

function getStorage() {
  return typeof window !== "undefined" ? window.localStorage : null;
}

function calcTotals(items: CartItem[]) {
  return { totalAmount: items.reduce((s, i) => s + i.price * i.quantity, 0), totalItems: items.reduce((s, i) => s + i.quantity, 0) };
}

function reducer(state: CartState, action: CartAction): CartState {
  let items: CartItem[];
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.menuId === action.payload.menuId);
      items = existing
        ? state.items.map((i) => (i.menuId === action.payload.menuId ? { ...i, quantity: i.quantity + action.payload.quantity } : i))
        : [...state.items, action.payload];
      return { items, ...calcTotals(items) };
    }
    case "REMOVE_ITEM":
      items = state.items.filter((i) => i.menuId !== action.payload.menuId);
      return { items, ...calcTotals(items) };
    case "UPDATE_QUANTITY":
      items = action.payload.quantity <= 0
        ? state.items.filter((i) => i.menuId !== action.payload.menuId)
        : state.items.map((i) => (i.menuId === action.payload.menuId ? { ...i, quantity: action.payload.quantity } : i));
      return { items, ...calcTotals(items) };
    case "CLEAR_CART":
      return { items: [], totalAmount: 0, totalItems: 0 };
    default:
      return state;
  }
}

const CartContext = createContext<{ state: CartState; dispatch: React.Dispatch<CartAction> } | null>(null);

export function CartProvider({ children, storageKey }: { children: ReactNode; storageKey: string }) {
  const [state, dispatch] = useReducer(reducer, { items: [], totalAmount: 0, totalItems: 0 }, () => {
    const storage = getStorage();
    if (!storage) return { items: [], totalAmount: 0, totalItems: 0 };
    try {
      const saved = storage.getItem(storageKey);
      if (saved) { const items = JSON.parse(saved) as CartItem[]; return { items, ...calcTotals(items) }; }
    } catch {}
    return { items: [], totalAmount: 0, totalItems: 0 };
  });

  useEffect(() => {
    const storage = getStorage();
    storage?.setItem(storageKey, JSON.stringify(state.items));
  }, [state.items, storageKey]);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
