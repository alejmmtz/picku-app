export type OrderStatus =
  | "requested"
  | "accepted"
  | "declined"
  | "delivering"
  | "delivered";

export interface ConsumerOrder {
  id: number;
  status: OrderStatus;
  total_price: number;
  pickup_code: string;
  delivery_notes: string | null;
  cancel_reason: string | null;
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  entrepreneur: {
    id: string;
    name: string;
    category: string;
    contact_info: string;
    img: string;
    entrepreneur_position: unknown;
    campus_location_id: number | null;
  };
  tracking: {
    estimated_distance: number | null;
    estimated_time: number | null;
    user_position: unknown;
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
  created_at: string;
  updated_at: string | null;
}
