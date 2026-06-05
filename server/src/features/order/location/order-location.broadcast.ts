import { broadcastHttp } from '../../../shared/realtime/broadcast.js';
import type { Coordinates } from '../../../shared/geo/geo.types.js';
import {
  ORDER_LOCATION_EVENT,
  orderLocationChannel,
} from './order-location.constants.js';

export type LocationBroadcastPayload = {
  orderId: number;
  position: Coordinates;
  lat: number;
  lng: number;
  estimatedDistanceMeters: number | null;
  estimatedTimeSeconds: number | null;
  updatedAt: string;
};

export const buildLocationBroadcastPayload = (
  orderId: number,
  position: Coordinates,
  estimatedDistanceMeters: number | null,
  estimatedTimeSeconds: number | null
): LocationBroadcastPayload => ({
  orderId,
  position,
  lat: position.latitude,
  lng: position.longitude,
  estimatedDistanceMeters,
  estimatedTimeSeconds,
  updatedAt: new Date().toISOString(),
});

export const broadcastOrderLocationUpdate = async (
  orderId: number,
  position: Coordinates,
  estimatedDistanceMeters: number | null,
  estimatedTimeSeconds: number | null
): Promise<void> => {
  const payload = buildLocationBroadcastPayload(
    orderId,
    position,
    estimatedDistanceMeters,
    estimatedTimeSeconds
  );

  await broadcastHttp(
    orderLocationChannel(orderId),
    ORDER_LOCATION_EVENT,
    payload
  );
};
