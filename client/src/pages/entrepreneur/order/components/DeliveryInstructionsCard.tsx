import { DELIVERY_INSTRUCTIONS } from "../orderFlow.constants";
import AppIcon from "./icons";

export default function DeliveryInstructionsCard() {
  return (
    <div className="mb-7 rounded-2xl border border-black/10 bg-background px-4 py-3">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-orange/30">
          <AppIcon name="map-pin" className="h-3.5 w-3.5 text-orange" />
        </div>
        <p className="text-[15px] font-medium text-black/85">
          Delivery Instructions
        </p>
      </div>

      <p className="text-sm leading-5 text-black/55">{DELIVERY_INSTRUCTIONS}</p>
    </div>
  );
}
