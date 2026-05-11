import type { OrderStatus } from "../../../types/order.types";
import type { AppIconName } from "./components/icons";

export const BRAND = "#ff702d";
export const BRAND_BG = "#fffaf4";
export const CODE_BG = "#fff5d1";

export const MAP_CENTER = { lat: 3.339998, lng: -76.529993 };

export const LEAFLET_CSS_URL =
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
export const LEAFLET_JS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
export const LEAFLET_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
export const LEAFLET_TILE_ATTRIBUTION =
  "&copy; OpenStreetMap contributors &copy; CARTO";

export const MAP_STYLE_EXAMPLES = {
  current: {
    tileUrl: LEAFLET_TILE_URL,
    attribution: LEAFLET_TILE_ATTRIBUTION,
    subdomains: "abcd",
    tileFilterClass: "",
    overlayClass: "",
  },
};

export const ACTIVE_MAP_STYLE = MAP_STYLE_EXAMPLES.current;

export const STATUSES = [
  { label: "Requested", icon: "clipboard" },
  { label: "Accepted", icon: "check-circle" },
  { label: "Delivering", icon: "navigation" },
  { label: "Delivered", icon: "thumbs-up" },
] satisfies Array<{ label: string; icon: AppIconName }>;

export const ORDER_STATUS_STEP_INDEX: Record<OrderStatus, number> = {
  requested: 0,
  accepted: 1,
  declined: 0,
  delivering: 2,
  delivered: 3,
};
