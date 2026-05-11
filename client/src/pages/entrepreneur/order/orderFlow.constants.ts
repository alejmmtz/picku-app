import type { AppIconName } from "./components/icons";

export const BRAND = "#500311";
export const ACCENT = "#ff702d";
export const SURFACE = "#fffaf4";

export const MAP_CENTER = { lat: 3.339998, lng: -76.529993 };

export const LEAFLET_CSS_URL =
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
export const LEAFLET_JS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
export const LEAFLET_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
export const LEAFLET_TILE_ATTRIBUTION =
  "&copy; OpenStreetMap contributors &copy; CARTO";

export const MAP_STYLE_EXAMPLES = {
  entrepreneur: {
    tileUrl: LEAFLET_TILE_URL,
    attribution: LEAFLET_TILE_ATTRIBUTION,
    subdomains: "abcd",
    tileFilterClass:
      "[filter:sepia(0.22)_saturate(1.03)_hue-rotate(-10deg)_brightness(1.08)_contrast(0.9)]",
    overlayClass: "bg-[rgba(246,220,200,0.12)]",
  },
};

export const ACTIVE_MAP_STYLE = MAP_STYLE_EXAMPLES.entrepreneur;

export const CUSTOMER_INFO = [
  { label: "Amount:", value: "$4.000", accent: true },
  { label: "Name:", value: "Alejandro Munoz", accent: false },
];

export const DELIVERY_INSTRUCTIONS = "I'm at the cafeteria, I have blue shirt.";

export const STATUSES = [
  { label: "Accepted", icon: "check-circle" },
  { label: "Preparing", icon: "clipboard" },
  { label: "Delivering", icon: "navigation" },
  { label: "Delivered", icon: "thumbs-up" },
] satisfies Array<{ label: string; icon: AppIconName }>;

export const CURRENT_STATUS = 2;
