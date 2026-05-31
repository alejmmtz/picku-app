import type { Coordinates, GeoJsonPoint } from '../../../shared/geo/geo.types.js';
import type { UUID } from '../../../shared/storage/shared.types.js';
import type { OrderStatus } from '../order.types.js';

/** Fixed pickup/delivery point set once by the consumer on order creation. */
export type ConsumerOrderLocationInput = {
  user_position: Coordinates;
  campus_location_id?: number;
};

export type SaveConsumerOrderLocationDTO = ConsumerOrderLocationInput & {
  order_id: number;
};

/** Single GPS sample from the entrepreneur device. */
export type EntrepreneurLocationUpdate = {
  position: Coordinates;
  /** ISO-8601 timestamp from the client device. */
  captured_at?: string;
  /** Horizontal accuracy reported by the device (meters). */
  accuracy_meters?: number;
};

/**
 * Burst payload for live tracking (WebSocket handler will validate and delegate here).
 * Only the latest sample by `captured_at` is persisted per burst.
 */
export type EntrepreneurLocationBurstDTO = {
  order_id: number;
  updates: EntrepreneurLocationUpdate[];
};

export type CampusLocation = {
  id: number;
  name: string;
  /** Coverage radius in meters (`campus_locations.radius`). */
  radius: number;
  location: Coordinates;
};

/** Row shape for `campus_locations` when loaded from PostgreSQL. */
export type CampusLocationRow = {
  id: number;
  name: string;
  radius: number;
  location: GeoJsonPoint | Coordinates;
};

export type OrderLocationRow = {
  id: number;
  consumer_id: UUID;
  entrepreneur_id: UUID;
  status: OrderStatus;
  campus_location_id: number | null;
  user_position: GeoJsonPoint | null;
  estimated_distance: number | null;
  estimated_time: number | null;
};

export type OrderLocationSnapshot = {
  order_id: number;
  consumer_id: UUID;
  entrepreneur_id: UUID;
  status: OrderStatus;
  campus_location_id: number | null;
  user_position: Coordinates | null;
  entrepreneur_position: Coordinates | null;
  estimated_distance_meters: number | null;
  estimated_time_seconds: number | null;
};

export type SaveConsumerOrderLocationResult = {
  order_id: number;
  user_position: Coordinates;
  campus_location_id: number | null;
};

export type ProcessEntrepreneurLocationBurstResult = {
  entrepreneur_id: UUID;
  order_id: number;
  position: Coordinates;
  estimated_distance_meters: number | null;
  estimated_time_seconds: number | null;
  /** Samples ignored because they were older than the winning update. */
  discarded_updates: number;
};

/**
 * Contract for location operations invoked from HTTP or WebSocket layers.
 * WebSocket gateways should call these methods — not embed persistence logic.
 */
export interface OrderLocationService {
  saveConsumerOrderLocation(
    consumerId: UUID,
    dto: SaveConsumerOrderLocationDTO
  ): Promise<SaveConsumerOrderLocationResult>;

  processEntrepreneurLocationBurst(
    entrepreneurId: UUID,
    dto: EntrepreneurLocationBurstDTO
  ): Promise<ProcessEntrepreneurLocationBurstResult>;

  getOrderLocationSnapshot(
    orderId: number,
    actor: { userId: UUID; role: 'consumer' | 'entrepreneur' }
  ): Promise<OrderLocationSnapshot>;
}
