import DeliveryInstructionsCard from "./DeliveryInstructionsCard";
import OrderInfoRows from "./OrderInfoRows";
import OrderStatusStepper from "./OrderStatusStepper";
import VerifyPickupCodeCard from "./VerifyPickupCodeCard";

export default function OrderSummaryCard() {
  return (
    <div className="absolute inset-x-0 bottom-0 top-[50%] z-20 overflow-y-auto rounded-t-[48px] bg-background px-12 pb-18 pt-10 shadow-[0_-8px_15px_-3px_rgba(0,0,0,0.1)]">
      <h2 className="mb-4 text-xl font-bold text-black">Order Information</h2>

      <OrderInfoRows />
      <DeliveryInstructionsCard />
      <OrderStatusStepper />
      <VerifyPickupCodeCard />
    </div>
  );
}
