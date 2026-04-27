"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const CartProvider = dynamic(
  () => import("@/contexts/CartContext").then((mod) => mod.CartProvider),
  { ssr: false }
);

function Header() {
  const { storeId, tableId } = useParams<{ storeId: string; tableId: string }>();
  const { state: auth } = useAuth();
  const { state: cart } = useCart();
  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-4">
      <span className="font-bold">{auth.storeName || "테이블오더"}</span>
      <div className="flex gap-4">
        <Link href={`/customer/${storeId}/${tableId}/orders`} className="text-sm text-gray-600 hover:text-black" data-testid="nav-orders">주문내역</Link>
        <Link href={`/customer/${storeId}/${tableId}/cart`} className="relative text-sm text-gray-600 hover:text-black" data-testid="nav-cart">
          🛒{cart.totalItems > 0 && <span className="absolute -right-3 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">{cart.totalItems}</span>}
        </Link>
      </div>
    </header>
  );
}

function InnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">{children}</div>
    </div>
  );
}

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { storeId, tableId } = useParams<{ storeId: string; tableId: string }>();
  return (
    <CartProvider storageKey={`cart_${storeId}_${tableId}`}>
      <InnerLayout>{children}</InnerLayout>
    </CartProvider>
  );
}
