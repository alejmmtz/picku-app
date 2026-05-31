import type { CampusLocation } from './order-location.types.js';

/**
 * Placeholder campus locations (Universidad Icesi — Cali).
 * Replace with rows from `campus_locations` when the table is seeded.
 */
export const MOCK_CAMPUS_LOCATIONS: readonly CampusLocation[] = [
  {
    id: 1,
    name: 'Bloque Administrativo',
    radius: 80,
    location: { latitude: 3.34285, longitude: -76.53095 },
  },
  {
    id: 2,
    name: 'Biblioteca Central',
    radius: 60,
    location: { latitude: 3.3431, longitude: -76.5314 },
  },
  {
    id: 3,
    name: 'Cafetería Estudiantil',
    radius: 50,
    location: { latitude: 3.34255, longitude: -76.5306 },
  },
  {
    id: 4,
    name: 'Auditorio Principal',
    radius: 70,
    location: { latitude: 3.34345, longitude: -76.5299 },
  },
  {
    id: 5,
    name: 'Zona Deportiva',
    radius: 120,
    location: { latitude: 3.3419, longitude: -76.5321 },
  },
] as const;

const campusLocationById = new Map(
  MOCK_CAMPUS_LOCATIONS.map((location) => [location.id, location])
);

export const getMockCampusLocationById = (
  id: number
): CampusLocation | undefined => campusLocationById.get(id);

export const isKnownCampusLocationId = (id: number): boolean =>
  campusLocationById.has(id);

export const assertKnownCampusLocationId = (id: number): CampusLocation => {
  const location = getMockCampusLocationById(id);

  if (!location) {
    throw new Error(`Unknown campus location id: ${id}`);
  }

  return location;
};
