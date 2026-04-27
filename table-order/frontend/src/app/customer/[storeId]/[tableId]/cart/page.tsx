"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder } from "@/actions/order";

export default function CartPage() {
  const { storeId, tableId } = useParams<{ storeId: string; tableId: string }>();
  const router = useRouter();
  const { state: auth, dispatch: authDispatch } = useAuth();
  const { state: cart, dispatch } = useCart();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleOrder() {
    if (!auth.token || cart.items.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const order = await createOrder(auth.token, {
        store_id: Number(storeId), table_id: Number(tableId),
        session_id: auth.sessionId ?? undefined,
        items: cart.items.map((i) => ({ menu_id: i.menuId, quantity: i.quantity })),
      });
      if (!auth.sessionId) authDispatch({ type: "UPDATE_SESSION", payload: { sessionId: order.session_id } });
      dispatch({ type: "CLEAR_CART" });
      setOrderNumber(order.order_number);
      setTimeout(() => router.push(`/customer/${storeId}/${tableId}`), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "주문 실패");
    } finally {
      setLoading(false);
    }
  }

  if (orderNumber) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8" data-testid="order-success">
        <div className="text-5xl">✅</div>
        <h2 className="mt-4 text-xl font-bold">주문 완료!</h2>
        <p className="mt-2 text-gray-600">주문번호: <span className="font-mono font-bold">{orderNumber}</span></p>
        <p className="mt-4 text-sm text-gray-400">5초 후 메뉴 화면으로 이동합니다...</p>
      </div>
    );
  }

  return (
    <main className="flex-1 p-4">
      <h1 className="mb-4 text-xl font-bold">장바구니</h1>
      {error && <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>}
      {cart.items.length === 0 ? (
        <p className="text-gray-500">장바구니가 비어있습니다.</p>
      ) : (
        <>
          {cart.items.map((item) => (
            <div key={item.menuId} className="mb-3 flex items-center justify-between rounded-lg border bg-white p-4" data-testid={`cart-item-${item.menuId}`}>
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">{item.price.toLocaleString()}원</p>
              </div>
              <div className="flex items-center gap-2">
                <button data-testid={`qty-minus-${item.menuId}`} onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { menuId: item.menuId, quantity: item.quantity - 1 } })} className="flex h-8 w-8 items-center justify-center rounded-full border">−</button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button data-testid={`qty-plus-${item.menuId}`} onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { menuId: item.menuId, quantity: item.quantity + 1 } })} className="flex h-8 w-8 items-center justify-center rounded-full border">+</button>
                <button data-testid={`remove-${item.menuId}`} onClick={() => dispatch({ type: "REMOVE_ITEM", payload: { menuId: item.menuId } })} className="ml-2 text-red-500 text-sm">삭제</button>
              </div>
            </div>
          ))}
          <div className="mt-6 rounded-lg border bg-white p-4">
            <div className="flex justify-between text-lg font-bold">
              <span>총 금액</span>
              <span data-testid="cart-total">{cart.totalAmount.toLocaleString()}원</span>
            </div>
            <button data-testid="order-submit" onClick={handleOrder} disabled={loading} className="mt-4 w-full rounded-lg bg-blue-600 py-3 text-white font-semibold disabled:opacity-50">
              {loading ? "주문 중..." : `${cart.totalAmount.toLocaleString()}원 주문하기`}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
