export interface Category {
  id: number;
  store_id: number;
  name: string;
  sort_order: number;
}

export interface MenuItem {
  id: number;
  store_id: number;
  category_id: number;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_available: boolean;
}

export interface OrderItem {
  id: number;
  menu_item_id: number;
  menu_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  store_id: number;
  table_id: number;
  session_id: number;
  order_number: string;
  status: "pending" | "preparing" | "completed";
  total_amount: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderHistory {
  id: number;
  table_id: number;
  table_number: number;
  session_id: number;
  order_id: number;
  order_number: string;
  order_data: string;
  total_amount: number;
  ordered_at: string;
  completed_at: string;
}

export interface TableInfo {
  id: number;
  store_id: number;
  table_number: number;
  current_session_id: number | null;
}

export interface CartItem {
  menuId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  role?: string;
  table_id?: number;
  session_id?: number;
  store_id?: number;
  store_name?: string;
}
