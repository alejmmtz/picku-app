import type { Geolocation, UUID } from '../../shared/storage/shared.types.js';

export enum OrderStatus {
  REQUESTED = 'requested',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
}

export type OrderItem = {
  id: number;
  product_id: number;
  order_id: number;
  quantity: number;
  unit_price: number;
};

export type Order = {
  id: number;
  consumer_id: UUID;
  entrepreneur_id: UUID;
  status: OrderStatus;
  total_price: number;
  pickup_code: string;
  estimated_distance: number | null;
  estimated_time: number | null;
  delivery_notes: string | null;
  cancel_reason: string | null;
  created_at: Date;
  updated_at: Date | null;
  campus_location_id: number | null;
  user_position: Geolocation | null;
  items?: OrderItem[];
};

export interface CreateOrderProductDTO {
  product_id: number;
  quantity: number;
}

export interface CreateOrderDTO {
  entrepreneur_id: UUID;
  delivery_notes?: string | null;
  products: CreateOrderProductDTO[];
  campus_location_id?: number | null;
  user_position: Geolocation;
}

export interface UpdateOrderDTO {
  status?: OrderStatus;
  pickup_code?: string;
  cancel_reason?: string | null;
}

export interface OrderResponseDTO {
  id: number;
  status: OrderStatus;
  total_price: number;
  pickup_code: string;
  delivery_notes: string | null;
  cancel_reason: string | null;
  customer: {
    id: UUID;
    name: string;
    phone: string;
  };
  entrepreneur: {
    id: UUID;
    name: string;
    category: string;
    contact_info: string;
    img: string;
    entrepreneur_position: Geolocation | null;
    campus_location_id: number | null;
  };
  tracking: {
    estimated_distance: number | null;
    estimated_time: number | null;
    user_position: Geolocation | null;
    campus_location_id: number | null;
    location_name: string | null;
  };
  items: {
    id: number;
    product_id: number;
    name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    img: string;
  }[];
  created_at: Date;
  updated_at: Date | null;
}
