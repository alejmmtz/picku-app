import type { OrderStatus } from "../../../types/order.types";
import type { AppIconName } from "./components/icons";
import { DEFAULT_MAP_TILE_STYLE } from "../../../providers/MapsProvider";

export const BRAND = "#ff702d";
export const BRAND_BG = "#fffaf4";
export const CODE_BG = "#fff5d1";

export const MAP_STYLE_EXAMPLES = {
  current: {
    ...DEFAULT_MAP_TILE_STYLE,
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
