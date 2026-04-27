"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { loginTable } from "@/actions/auth";

export default function CustomerLoginPage() {
  const router = useRouter();
  const { dispatch } = useAuth();
  const [storeId, setStoreId] = useState("");
  const [tableNum, setTableNum] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginTable(storeId, Number(tableNum), password);
      dispatch({ type: "LOGIN_TABLE", payload: { token: res.access_token, storeId: res.store_id!, tableId: res.table_id!, sessionId: res.session_id ?? null, storeName: res.store_name ?? "" } });
      router.push(`/customer/${res.store_id}/${res.table_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg" data-testid="table-login-form">
        <h1 className="mb-6 text-center text-2xl font-bold">테이블 로그인</h1>
        {error && <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-600" data-testid="login-error">{error}</p>}
        <label className="mb-1 block text-sm font-medium">매장 식별자</label>
        <input data-testid="store-id-input" className="mb-4 w-full rounded-lg border p-3" value={storeId} onChange={(e) => setStoreId(e.target.value)} required />
        <label className="mb-1 block text-sm font-medium">테이블 번호</label>
        <input data-testid="table-number-input" type="number" className="mb-4 w-full rounded-lg border p-3" value={tableNum} onChange={(e) => setTableNum(e.target.value)} required min={1} />
        <label className="mb-1 block text-sm font-medium">비밀번호</label>
        <input data-testid="password-input" type="password" className="mb-6 w-full rounded-lg border p-3" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button data-testid="login-submit" type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold disabled:opacity-50">
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
