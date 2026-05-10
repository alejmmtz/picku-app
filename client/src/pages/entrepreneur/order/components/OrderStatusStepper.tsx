import { Fragment } from "react";
import { CURRENT_STATUS, STATUSES } from "../orderFlow.constants";
import AppIcon from "./icons";

export default function OrderStatusStepper() {
  return (
    <div className="mb-7 flex w-full items-start gap-2">
      {STATUSES.map(({ icon, label }, index) => (
        <Fragment key={label}>
          <div className="flex flex-col items-center">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all duration-300 ease-out ${
                index <= CURRENT_STATUS ? "bg-maroon" : "bg-black/6"
              }`}
            >
              <AppIcon
                name={icon}
                className={`h-5 w-5 ${
                  index <= CURRENT_STATUS ? "text-white" : "text-black/25"
                }`}
              />
            </div>

            <span
              className={`mt-1 text-center text-[13px] ${
                index <= CURRENT_STATUS ? "text-maroon" : "text-black/28"
              }`}
            >
              {label}
            </span>
          </div>

          {index < STATUSES.length - 1 && (
            <div
              className={`mt-6 h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                index < CURRENT_STATUS ? "bg-maroon" : "bg-black/10"
              }`}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}
