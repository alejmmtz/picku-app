export type OrderStatus =
  | "requested"
  | "accepted"
  | "preparing"
  | "declined"
  | "delivering"
  | "delivered";

// Interfaz para compartir coordenadas entre frontend y backend
export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface CreateOrderProductDTO {
  product_id: number;
  quantity: number;
}

export interface CreateOrderDTO {
  entrepreneur_id: string;
  delivery_notes?: string | null;
  products: CreateOrderProductDTO[];
  // Campo añadido para la geolocalización inicial al hacer checkout
  location?: GeoLocation;
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

export interface OrderCoordinates {
  latitude: number;
  longitude: number;
}

export interface OrderLocationSnapshot {
  order_id: number;
  consumer_id: string;
  entrepreneur_id: string;
  status: OrderStatus;
  campus_location_id: number | null;
  user_position: OrderCoordinates | null;
  entrepreneur_position: OrderCoordinates | null;
  estimated_distance_meters: number | null;
  estimated_time_seconds: number | null;
}

export interface OrderResponse {
  id: number;
  consumer_id: string;
  entrepreneur_id: string;
  status: OrderStatus;
  total_price: number;
  pickup_code: string;
  estimated_distance: number | null;
  estimated_time: number | null;
  delivery_notes: string | null;
  cancel_reason: string | null;
  // Si el backend también devuelve la ubicación inicial:
  location?: GeoLocation;
  customer: OrderCustomer;
  entrepreneur: OrderEntrepreneur;
  items: OrderItem[];
  created_at: string;
  updated_at: string | null;
}
