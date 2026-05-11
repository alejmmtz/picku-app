import type { OrderResponse } from "../../../../types/order.types";
import DeliveryInstructionsCard from "./DeliveryInstructionsCard";
import OrderInfoRows from "./OrderInfoRows";
import OrderStatusStepper from "./OrderStatusStepper";
import VerifyPickupCodeCard from "./VerifyPickupCodeCard";

type OrderSummaryCardProps = {
  order: OrderResponse;
  pickupCode: string;
  declineReason: string;
  isSubmitting: boolean;
  onPickupCodeChange: (value: string) => void;
  onDeclineReasonChange: (value: string) => void;
  onAccept: () => void;
  onDecline: () => void;
  onStartDelivery: () => void;
  onComplete: () => void;
};

const formatCurrency = (value: number) =>
  `$${value.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;

export default function OrderSummaryCard({
  order,
  pickupCode,
  declineReason,
  isSubmitting,
  onPickupCodeChange,
  onDeclineReasonChange,
  onAccept,
  onDecline,
  onStartDelivery,
  onComplete,
}: OrderSummaryCardProps) {
  const rows = [
    {
      label: "Amount:",
      value: formatCurrency(order.total_price),
      accent: true,
    },
    {
      label: "Customer:",
      value: order.customer.name,
    },
  ];

  const deliveryInstructions =
    order.delivery_notes?.trim() || "The customer did not add instructions.";

  return (
    <div className="absolute inset-x-0 bottom-0 top-[50%] z-20 overflow-y-auto rounded-t-[48px] bg-background px-12 pb-18 pt-10 shadow-[0_-8px_15px_-3px_rgba(0,0,0,0.1)]">
      <h2 className="mb-4 text-xl font-bold text-black">Order Information</h2>

      <OrderInfoRows rows={rows} />
      <DeliveryInstructionsCard instructions={deliveryInstructions} />
      <OrderStatusStepper status={order.status} />
      <VerifyPickupCodeCard
        status={order.status}
        pickupCode={pickupCode}
        declineReason={declineReason}
        isSubmitting={isSubmitting}
        onPickupCodeChange={onPickupCodeChange}
        onDeclineReasonChange={onDeclineReasonChange}
        onAccept={onAccept}
        onDecline={onDecline}
        onStartDelivery={onStartDelivery}
        onComplete={onComplete}
      />
    </div>
  );
}
