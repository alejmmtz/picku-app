import type { OrderStatus } from "../../../types/order.types";
import type { AppIconName } from "./components/icons";
import { DEFAULT_MAP_TILE_STYLE } from "../../../providers/MapsProvider";

export const BRAND = "#500311";
export const ACCENT = "#ff702d";
export const SURFACE = "#fffaf4";

export const MAP_STYLE_EXAMPLES = {
  entrepreneur: {
    ...DEFAULT_MAP_TILE_STYLE,
    tileFilterClass: "",
    overlayClass: "",
  },
};

export const ACTIVE_MAP_STYLE = MAP_STYLE_EXAMPLES.entrepreneur;

export const STATUSES = [
  { label: "Accepted", icon: "check-circle" },
  { label: "Preparing", icon: "clipboard" },
  { label: "On Way", icon: "navigation" },
  { label: "Delivered", icon: "thumbs-up" },
] satisfies Array<{ label: string; icon: AppIconName }>;

export const ORDER_STATUS_STEP_INDEX: Record<OrderStatus, number> = {
  requested: -1,
  accepted: 0,
  preparing: 1,
  declined: -1,
  delivering: 2,
  delivered: 3,
};
