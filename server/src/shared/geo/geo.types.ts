/**
 * Application-level representation of a geographic point (WGS84).
 * Maps to PostGIS `geography` / `geometry` columns (USER-DEFINED in PostgreSQL).
 *
 * PostGIS note: ST_MakePoint expects (longitude, latitude) order internally.
 */
export type Coordinates = {
  latitude: number;
  longitude: number;
};

/** Raw value returned by PostGIS when not transformed in SQL (WKB hex or EWKT). */
export type PostgisGeographyRaw = string;

/**
 * GeoJSON Point as returned by `ST_AsGeoJSON` — preferred DB → app mapping.
 * @see https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.2
 */
export type GeoJsonPoint = {
  type: 'Point';
  coordinates: [longitude: number, latitude: number];
};

export type GeoPointInput = Coordinates | GeoJsonPoint;
