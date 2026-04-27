"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchCategories, fetchMenus } from "@/actions/menu";
import { useCart } from "@/contexts/CartContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { Category, MenuItem } from "@/lib/types";

export default function MenuPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const { dispatch } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(storeId);
    Promise.all([fetchCategories(id), fetchMenus(id)]).then(([cats, items]) => {
      setCategories(cats);
      setMenus(items);
      setLoading(false);
    });
  }, [storeId]);

  const filtered = selectedCat ? menus.filter((m) => m.category_id === selectedCat) : menus;

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <aside className="w-40 shrink-0 border-r bg-white p-3" data-testid="category-sidebar">
        <button onClick={() => setSelectedCat(null)} className={`mb-1 block w-full rounded-lg px-3 py-2 text-left text-sm ${!selectedCat ? "bg-blue-100 font-bold" : "hover:bg-gray-100"}`} data-testid="category-all">전체</button>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setSelectedCat(c.id)} className={`mb-1 block w-full rounded-lg px-3 py-2 text-left text-sm ${selectedCat === c.id ? "bg-blue-100 font-bold" : "hover:bg-gray-100"}`} data-testid={`category-${c.id}`}>{c.name}</button>
        ))}
      </aside>
      <main className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {filtered.filter((m) => m.is_available).map((m) => (
            <div key={m.id} className="rounded-xl border bg-white p-4 shadow-sm" data-testid={`menu-card-${m.id}`}>
              {m.image_url && <img src={m.image_url} alt={m.name} className="mb-2 h-32 w-full rounded-lg object-cover" />}
              <h3 className="font-semibold">{m.name}</h3>
              {m.description && <p className="mt-1 text-xs text-gray-500 line-clamp-2">{m.description}</p>}
              <p className="mt-2 font-bold text-blue-600">{m.price.toLocaleString()}원</p>
              <button data-testid={`add-to-cart-${m.id}`} onClick={() => dispatch({ type: "ADD_ITEM", payload: { menuId: m.id, name: m.name, price: m.price, quantity: 1, imageUrl: m.image_url } })} className="mt-3 w-full rounded-lg bg-blue-600 py-2 text-sm text-white">담기</button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
