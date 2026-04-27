"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { loginAdmin } from "@/actions/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { dispatch } = useAuth();
  const [storeId, setStoreId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginAdmin(storeId, username, password);
      dispatch({ type: "LOGIN_ADMIN", payload: { token: res.access_token, storeId: res.store_id!, role: res.role!, storeName: res.store_name ?? "" } });
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg" data-testid="admin-login-form">
        <h1 className="mb-6 text-center text-2xl font-bold">관리자 로그인</h1>
        {error && <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-600" data-testid="admin-login-error">{error}</p>}
        <label className="mb-1 block text-sm font-medium">매장 식별자</label>
        <input data-testid="admin-store-input" className="mb-4 w-full rounded-lg border p-3" value={storeId} onChange={(e) => setStoreId(e.target.value)} required />
        <label className="mb-1 block text-sm font-medium">사용자명</label>
        <input data-testid="admin-username-input" className="mb-4 w-full rounded-lg border p-3" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <label className="mb-1 block text-sm font-medium">비밀번호</label>
        <input data-testid="admin-password-input" type="password" className="mb-6 w-full rounded-lg border p-3" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button data-testid="admin-login-submit" type="submit" disabled={loading} className="w-full rounded-lg bg-indigo-600 py-3 text-white font-semibold disabled:opacity-50">
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
