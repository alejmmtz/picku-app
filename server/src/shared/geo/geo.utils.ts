import type { Coordinates, GeoJsonPoint, GeoPointInput } from './geo.types.js';

const EARTH_RADIUS_METERS = 6_371_000;
const DEFAULT_WALKING_SPEED_MPS = 1.4;

export const isGeoJsonPoint = (value: GeoPointInput): value is GeoJsonPoint =>
  typeof value === 'object' &&
  value !== null &&
  'type' in value &&
  value.type === 'Point';

export const toCoordinates = (input: GeoPointInput): Coordinates => {
  if (isGeoJsonPoint(input)) {
    const [longitude, latitude] = input.coordinates;
    return { latitude, longitude };
  }

  return input;
};

/**
 * SQL parameters for binding a WGS84 point to a `geography` column.
 * Usage: `ST_SetSRID(ST_MakePoint($lng, $lat), 4326)::geography`
 */
export const toPostgisPointParams = (
  point: Coordinates
): { longitude: number; latitude: number } => ({
  longitude: point.longitude,
  latitude: point.latitude,
});

export const fromGeoJsonPoint = (geoJson: GeoJsonPoint): Coordinates =>
  toCoordinates(geoJson);

/**
 * Haversine distance between two WGS84 coordinates (meters).
 */
export const distanceMeters = (from: Coordinates, to: Coordinates): number => {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const dLat = toRadians(to.latitude - from.latitude);
  const dLng = toRadians(to.longitude - from.longitude);

  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
};

/**
 * Rough ETA from distance using average walking speed (seconds).
 * Replace with routing API when available.
 */
export const estimateTravelTimeSeconds = (
  distanceMetersValue: number,
  speedMps: number = DEFAULT_WALKING_SPEED_MPS
): number => Math.ceil(distanceMetersValue / speedMps);

/**
 * Returns true when `point` lies within `radiusMeters` of `center`.
 */
export const isWithinRadius = (
  center: Coordinates,
  point: Coordinates,
  radiusMeters: number
): boolean => distanceMeters(center, point) <= radiusMeters;
