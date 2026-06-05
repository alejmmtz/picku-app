import type { MapCenter } from "../providers/MapsProvider";

type CoordinateLike =
  | { lat: number; lng: number }
  | { latitude: number; longitude: number }
  | null
  | undefined;

export const toMapCenter = (value: unknown): MapCenter | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const coords = value as Record<string, unknown>;

  if (typeof coords.lat === "number" && typeof coords.lng === "number") {
    return { lat: coords.lat, lng: coords.lng };
  }

  if (
    typeof coords.latitude === "number" &&
    typeof coords.longitude === "number"
  ) {
    return { lat: coords.latitude, lng: coords.longitude };
  }

  if ("position" in coords) {
    return toMapCenter(coords.position);
  }

  return null;
};

export const toBackendCoordinates = (center: MapCenter) => ({
  latitude: center.lat,
  longitude: center.lng,
});

export const isSameMapCenter = (
  a: MapCenter | null | undefined,
  b: MapCenter | null | undefined,
  epsilon = 0.000001,
): boolean => {
  if (!a || !b) return false;

  return (
    Math.abs(a.lat - b.lat) <= epsilon && Math.abs(a.lng - b.lng) <= epsilon
  );
};

export const orderLocationChannel = (orderId: number) => `order-${orderId}`;

export const ORDER_LOCATION_EVENT = "location-update";

export const buildLocationBroadcastPayload = (center: MapCenter) => ({
  position: toBackendCoordinates(center),
  lat: center.lat,
  lng: center.lng,
});

export type { CoordinateLike };
