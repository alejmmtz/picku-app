import type {
  Coordinates,
  GeoJsonPoint,
} from '../../../shared/geo/geo.types.js';
import type { UUID } from '../../../shared/storage/shared.types.js';
import type { OrderStatus } from '../order.types.js';

export type ConsumerOrderLocationInput = {
  user_position: Coordinates;
  campus_location_id?: number;
};

export type SaveConsumerOrderLocationDTO = ConsumerOrderLocationInput & {
  order_id: number;
};

export type EntrepreneurLocationUpdate = {
  position: Coordinates;
  captured_at?: string;
  accuracy_meters?: number;
};

export type EntrepreneurLocationBurstDTO = {
  order_id: number;
  updates: EntrepreneurLocationUpdate[];
};

export type CampusLocation = {
  id: number;
  name: string;
  radius: number;
  location: Coordinates;
};

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
  discarded_updates: number;
};

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
