export type OrderStatus =
  | "requested"
  | "accepted"
  | "declined"
  | "delivering"
  | "delivered";

export interface CreateOrderProductDTO {
  product_id: number;
  quantity: number;
}

export interface CreateOrderDTO {
  entrepreneur_id: string;
  delivery_notes?: string | null;
  products: CreateOrderProductDTO[];
}

export interface UpdateOrderDTO {
  status?: OrderStatus;
  pickup_code?: string;
  cancel_reason?: string | null;
}

export interface OrderItem {
  id: number;
  product_id: number;
  name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  img: string;
}

export interface OrderCustomer {
  id: string;
  name: string;
  phone: string;
}

export interface OrderEntrepreneur {
  id: string;
  name: string;
  category: string;
  contact_info: string;
  img: string;
}

export interface OrderResponse {
  id: number;
  consumer_id: string;
  entrepreneur_id: string;
  status: OrderStatus;
  total_price: number;
  pickup_code: string;
  delivery_notes: string | null;
  cancel_reason: string | null;
  customer: OrderCustomer;
  entrepreneur: OrderEntrepreneur;
  items: OrderItem[];
  created_at: string;
  updated_at: string | null;
}
