import AppIcon from "./icons";
import { CURRENT_STATUS, STATUSES } from "../orderFlow.constants";

export default function OrderStatusStepper() {
  return (
    <div className="flex w-full items-start gap-2 mb-8">
      {STATUSES.map(({ icon, label }, index) => (
        <>
          <div key={index} className="flex flex-col items-center">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-all duration-300 ease-out ${
                index <= CURRENT_STATUS ? "bg-maroon" : "bg-black/5"
              }`}
            >
              <AppIcon
                name={icon}
                className={`h-6 w-6 ${
                  index <= CURRENT_STATUS ? "text-white" : "text-black/30"
                }`}
              />
            </div>
            <span
              className={`mt-1  text-center text-sm  ${
                index <= CURRENT_STATUS ? "text-mabg-maroon" : "text-black/40"
              }`}
            >
              {label}
            </span>
          </div>

          {index < STATUSES.length - 1 && (
            <div
              key={`line-${index}`}
              className={`mt-7 h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                index < CURRENT_STATUS ? "bg-maroon" : "bg-black/15"
              }`}
            />
          )}
        </>
      ))}
    </div>
  );
}
