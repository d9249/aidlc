"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCategories, fetchMenus, createMenu, updateMenu, deleteMenu } from "@/actions/menu";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { Category, MenuItem } from "@/lib/types";

export default function MenuManagementPage() {
  const router = useRouter();
  const { state: auth, dispatch } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState({ name: "", price: 0, description: "", category_id: 0, image_url: "" });
  const [confirm, setConfirm] = useState<{ id: number } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth.token || auth.role !== "manager") { router.push("/admin/login"); return; }
    loadData();
  }, [auth.token, auth.role, auth.storeId, router]);

  async function loadData() {
    if (!auth.storeId) return;
    const [cats, items] = await Promise.all([fetchCategories(auth.storeId), fetchMenus(auth.storeId)]);
    setCategories(cats);
    setMenus(items);
  }

  function startEdit(m: MenuItem) {
    setEditing(m);
    setForm({ name: m.name, price: m.price, description: m.description ?? "", category_id: m.category_id, image_url: m.image_url ?? "" });
  }

  function resetForm() {
    setEditing(null);
    setForm({ name: "", price: 0, description: "", category_id: categories[0]?.id ?? 0, image_url: "" });
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!auth.token || !form.name || form.category_id === 0) { setError("필수 항목을 입력하세요"); return; }
    try {
      if (editing) {
        await updateMenu(auth.token, editing.id, form);
      } else {
        await createMenu(auth.token, { ...form, description: form.description || undefined, image_url: form.image_url || undefined });
      }
      resetForm();
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 실패");
    }
  }

  async function handleDelete(id: number) {
    if (!auth.token) return;
    await deleteMenu(auth.token, id);
    setConfirm(null);
    loadData();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex h-14 items-center justify-between border-b bg-white px-6">
        <span className="font-bold">{auth.storeName} — 메뉴 관리</span>
        <div className="flex gap-4">
          <Link href="/admin/dashboard" className="text-sm text-gray-600 hover:text-black">대시보드</Link>
          <button onClick={() => { dispatch({ type: "LOGOUT" }); router.push("/admin/login"); }} className="text-sm text-red-600">로그아웃</button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-6">
        <form onSubmit={handleSubmit} className="mb-8 rounded-xl bg-white p-6 shadow-sm" data-testid="menu-form">
          <h2 className="mb-4 text-lg font-bold">{editing ? "메뉴 수정" : "메뉴 등록"}</h2>
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">메뉴명 *</label>
              <input data-testid="menu-name-input" className="w-full rounded-lg border p-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">가격 *</label>
              <input data-testid="menu-price-input" type="number" className="w-full rounded-lg border p-2" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} min={0} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">카테고리 *</label>
              <select data-testid="menu-category-select" className="w-full rounded-lg border p-2" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}>
                <option value={0}>선택</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">이미지 URL</label>
              <input data-testid="menu-image-input" className="w-full rounded-lg border p-2" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium">설명</label>
            <textarea data-testid="menu-desc-input" className="w-full rounded-lg border p-2" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="mt-4 flex gap-2">
            <button data-testid="menu-submit" type="submit" className="rounded-lg bg-indigo-600 px-6 py-2 text-white">{editing ? "수정" : "등록"}</button>
            {editing && <button type="button" onClick={resetForm} className="rounded-lg border px-6 py-2">취소</button>}
          </div>
        </form>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">메뉴 목록</h2>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left"><th className="p-2">메뉴명</th><th className="p-2">카테고리</th><th className="p-2">가격</th><th className="p-2">상태</th><th className="p-2">작업</th></tr></thead>
            <tbody>
              {menus.map((m) => (
                <tr key={m.id} className="border-b" data-testid={`menu-row-${m.id}`}>
                  <td className="p-2">{m.name}</td>
                  <td className="p-2">{categories.find((c) => c.id === m.category_id)?.name}</td>
                  <td className="p-2">{m.price.toLocaleString()}원</td>
                  <td className="p-2">{m.is_available ? "판매중" : "중지"}</td>
                  <td className="flex gap-2 p-2">
                    <button data-testid={`edit-menu-${m.id}`} onClick={() => startEdit(m)} className="text-blue-600">수정</button>
                    <button data-testid={`delete-menu-${m.id}`} onClick={() => setConfirm({ id: m.id })} className="text-red-600">삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <ConfirmDialog title="메뉴 삭제" message="이 메뉴를 삭제하시겠습니까?" isOpen={!!confirm} onConfirm={() => confirm && handleDelete(confirm.id)} onCancel={() => setConfirm(null)} />
    </div>
  );
}
