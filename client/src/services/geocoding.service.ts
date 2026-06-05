import type { MapCenter } from "../providers/MapsProvider";

type GoogleGeocodingResponse = {
  results?: Array<{
    formatted_address?: string;
  }>;
  status?: string;
};

type NominatimReverseResponse = {
  display_name?: string;
};

const GOOGLE_GEOCODING_KEY = import.meta.env.VITE_GOOGLE_GEOCODING_API_KEY as
  | string
  | undefined;

const coordinateLabel = ({ lat, lng }: MapCenter) =>
  `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

const reverseGeocodeWithGoogle = async (
  center: MapCenter,
): Promise<string | null> => {
  if (!GOOGLE_GEOCODING_KEY) {
    return null;
  }

  const params = new URLSearchParams({
    key: GOOGLE_GEOCODING_KEY,
    language: "es",
    latlng: `${center.lat},${center.lng}`,
  });

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`,
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as GoogleGeocodingResponse;

  if (payload.status !== "OK") {
    return null;
  }

  return payload.results?.[0]?.formatted_address?.trim() || null;
};

const reverseGeocodeWithNominatim = async (
  center: MapCenter,
): Promise<string | null> => {
  const params = new URLSearchParams({
    "accept-language": "es",
    addressdetails: "1",
    format: "jsonv2",
    lat: String(center.lat),
    lon: String(center.lng),
    zoom: "18",
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as NominatimReverseResponse;
  return payload.display_name?.trim() || null;
};

export const reverseGeocode = async (center: MapCenter): Promise<string> => {
  try {
    const googleAddress = await reverseGeocodeWithGoogle(center);

    if (googleAddress) {
      return googleAddress;
    }
  } catch {
    // Fall through to the OpenStreetMap-backed provider.
  }

  try {
    const nominatimAddress = await reverseGeocodeWithNominatim(center);

    if (nominatimAddress) {
      return nominatimAddress;
    }
  } catch {
    // Fall through to the coordinate fallback.
  }

  return `Address not found (${coordinateLabel(center)})`;
};

