"use client";
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";

interface AuthState {
  token: string | null;
  userType: "admin" | "table" | null;
  storeId: number | null;
  tableId: number | null;
  sessionId: number | null;
  role: string | null;
  storeName: string | null;
}

type AuthAction =
  | { type: "LOGIN_ADMIN"; payload: { token: string; storeId: number; role: string; storeName: string } }
  | { type: "LOGIN_TABLE"; payload: { token: string; storeId: number; tableId: number; sessionId: number | null; storeName: string } }
  | { type: "UPDATE_SESSION"; payload: { sessionId: number } }
  | { type: "LOGOUT" };

const initial: AuthState = { token: null, userType: null, storeId: null, tableId: null, sessionId: null, role: null, storeName: null };

function getStorage() {
  return typeof window !== "undefined" ? window.localStorage : null;
}

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_ADMIN":
      return { ...state, token: action.payload.token, userType: "admin", storeId: action.payload.storeId, role: action.payload.role, storeName: action.payload.storeName, tableId: null, sessionId: null };
    case "LOGIN_TABLE":
      return { ...state, token: action.payload.token, userType: "table", storeId: action.payload.storeId, tableId: action.payload.tableId, sessionId: action.payload.sessionId, storeName: action.payload.storeName, role: null };
    case "UPDATE_SESSION":
      return { ...state, sessionId: action.payload.sessionId };
    case "LOGOUT":
      return initial;
    default:
      return state;
  }
}

const AuthContext = createContext<{ state: AuthState; dispatch: React.Dispatch<AuthAction> } | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial, () => {
    const storage = getStorage();
    if (!storage) return initial;
    try {
      const saved = storage.getItem("auth");
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;
    if (state.token) {
      storage.setItem("auth", JSON.stringify(state));
    } else {
      storage.removeItem("auth");
    }
  }, [state]);

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
