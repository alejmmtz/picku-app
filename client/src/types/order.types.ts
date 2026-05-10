import type { CartItem } from "./cart.types";

export interface UserPosition {
  latitude: number;
  longitude: number;
}

export interface CreateOrderDTO {
  items: CartItem[];
  delivery_notes: string;
  user_position?: UserPosition;
  total_price: number;
}