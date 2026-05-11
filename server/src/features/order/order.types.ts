import type { UUID } from '../../shared/storage/shared.types.js';

export enum OrderStatus {
  REQUESTED = 'requested',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
}

export type OrderActorRole = 'consumer' | 'entrepreneur';

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
  delivery_notes: string | null;
  cancel_reason: string | null;
  created_at: Date;
  updated_at: Date | null;
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
}

export interface UpdateOrderDTO {
  status?: OrderStatus;
  pickup_code?: string;
  cancel_reason?: string | null;
}

export interface OrderResponseDTO {
  id: number;
  consumer_id: UUID;
  entrepreneur_id: UUID;
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
