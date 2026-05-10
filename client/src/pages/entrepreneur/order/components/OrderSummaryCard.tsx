import DeliveryInstructionsCard from "./DeliveryInstructionsCard";
import OrderInfoRows from "./OrderInfoRows";
import OrderStatusStepper from "./OrderStatusStepper";
import VerifyPickupCodeCard from "./VerifyPickupCodeCard";

export default function OrderSummaryCard() {
  return (
    <div className="absolute inset-x-0 bottom-0 top-[47%] z-20 overflow-y-auto rounded-t-[42px] bg-background px-8 pb-8 pt-7 shadow-[0_-8px_15px_-3px_rgba(0,0,0,0.08)]">
      <h2 className="mb-4 text-[28px] font-semibold leading-none text-black">
        Customer information
      </h2>

      <OrderInfoRows />
      <DeliveryInstructionsCard />
      <OrderStatusStepper />
      <VerifyPickupCodeCard />
    </div>
  );
}
