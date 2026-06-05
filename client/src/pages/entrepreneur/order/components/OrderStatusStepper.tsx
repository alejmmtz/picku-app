import type { OrderStatus } from "../../../../types/order.types";
import AppIcon from "./icons";
import { ORDER_STATUS_STEP_INDEX, STATUSES } from "../orderFlow.constants";

type OrderStatusStepperProps = {
  status: OrderStatus;
};

export default function OrderStatusStepper({
  status,
}: OrderStatusStepperProps) {
  const currentStatusIndex = ORDER_STATUS_STEP_INDEX[status];

  return (
    <div className="flex w-full items-start gap-2 mb-8">
      {STATUSES.map(({ icon, label }, index) => (
        <>
          <div key={index} className="flex flex-col items-center">
            <div
              className={`flex h-12 w-12 shrink-0 transition-all duration-500 items-center justify-center rounded-full  ease-out ${
                index <= currentStatusIndex ? "bg-maroon" : "bg-black/5"
              }`}
            >
              <AppIcon
                name={icon}
                className={`h-6 w-6 transition-all duration-500 ${
                  index <= currentStatusIndex ? "text-white" : "text-black/30"
                }`}
              />
            </div>
            <span
              className={`mt-1 text-center text-xs transition-all duration-500 ${
                index <= currentStatusIndex ? "text-maroon" : "text-black/40"
              }`}
            >
              {label}
            </span>
          </div>

          {index < STATUSES.length - 1 && (
            <div
              key={`line-${index}`}
              className={`mt-6 h-0.5 flex-1 rounded-full transition-all duration-500  ${
                index < currentStatusIndex ? "bg-maroon" : "bg-black/15"
              }`}
            />
          )}
        </>
      ))}
    </div>
  );
}
