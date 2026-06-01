import type { CampusLocation } from './order-location.types.js';

export const CAMPUS_LOCATIONS: readonly CampusLocation[] = [
  {
    id: 1,
    name: 'Auditorios',
    radius: 40,
    location: { latitude: 3.34262, longitude: -76.529695 },
  },
  {
    id: 2,
    name: 'Biblioteca Central',
    radius: 40,
    location: { latitude: 3.341784, longitude: -76.52997 },
  },
  {
    id: 3,
    name: 'Central',
    radius: 40,
    location: { latitude: 3.342111, longitude: -76.529579 },
  },
  {
    id: 4,
    name: 'Edificio F',
    radius: 70,
    location: { latitude: 3.3411618, longitude: -76.5273238 },
  },
  {
    id: 5,
    name: 'Coliseo 1',
    radius: 80,
    location: { latitude: 3.34128, longitude: -76.528544 },
  },
  {
    id: 6,
    name: 'Caballerizas',
    radius: 80,
    location: { latitude: 3.3413874, longitude: -76.5280125 },
  },
  {
    id: 7,
    name: 'Bienestar Universitario',
    radius: 15,
    location: { latitude: 3.3408017, longitude: -76.5297968 },
  },
  {
    id: 8,
    name: 'Taller Industrial',
    radius: 30,
    location: { latitude: 3.3407408, longitude: -76.5297673 },
  },
  {
    id: 9,
    name: 'Edificio M',
    radius: 30,
    location: { latitude: 3.342354, longitude: -76.5306686 },
  },
] as const;

const campusLocationById = new Map(
  CAMPUS_LOCATIONS.map((location) => [location.id, location])
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
