import type { OrderStatus } from "../../../types/order.types";
import type { AppIconName } from "./components/icons";
import { DEFAULT_MAP_TILE_STYLE } from "../../../providers/MapsProvider";

export const BRAND = "#500311";
export const ACCENT = "#ff702d";
export const SURFACE = "#fffaf4";

export const MAP_STYLE_EXAMPLES = {
  entrepreneur: {
    ...DEFAULT_MAP_TILE_STYLE,
    tileFilterClass:
      "[filter:sepia(0.22)_saturate(1.03)_hue-rotate(-10deg)_brightness(1.08)_contrast(0.9)]",
    overlayClass: "bg-[rgba(246,220,200,0.12)]",
  },
};

export const ACTIVE_MAP_STYLE = MAP_STYLE_EXAMPLES.entrepreneur;

export const STATUSES = [
  { label: "Requested", icon: "clipboard" },
  { label: "Accepted", icon: "check-circle" },
  { label: "Preparing", icon: "clipboard" },
  { label: "Delivering", icon: "navigation" },
  { label: "Delivered", icon: "thumbs-up" },
] satisfies Array<{ label: string; icon: AppIconName }>;

export const ORDER_STATUS_STEP_INDEX: Record<OrderStatus, number> = {
  requested: 0,
  accepted: 1,
  preparing: 2,
  declined: 0,
  delivering: 3,
  delivered: 4,
};
