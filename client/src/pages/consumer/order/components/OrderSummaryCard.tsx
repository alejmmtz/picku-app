import type { OrderResponse } from "../../../../types/order.types";
import OrderInfoRows from "./OrderInfoRows";
import OrderStatusStepper from "./OrderStatusStepper";
import PickupCodeCard from "./PickupCodeCard";

type OrderSummaryCardProps = {
  order: OrderResponse;
};

const formatCurrency = (value: number) =>
  `$${value.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;

const getHeading = (status: OrderResponse["status"]) => {
  if (status === "delivering") {
    return "Your order is on the way!";
  }

  if (status === "accepted") {
    return "Your order is being prepared!";
  }

  return "Your order was received!";
};

export default function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  const rows = [
    {
      label: "Amount:",
      value: formatCurrency(order.total_price),
      accent: true,
    },
    {
      label: "Business:",
      value: order.entrepreneur.name,
    },
    {
      label: "Pickup:",
      value: order.delivery_notes?.trim() ? "Review your notes" : "Confirmed in app",
    },
  ];

  return (
    <div className="absolute inset-x-0 bottom-0 top-[50%] z-20 overflow-y-auto rounded-t-[48px] bg-background px-12 pb-18 pt-10 shadow-[0_-8px_15px_-3px_rgba(0,0,0,0.1)]">
      <h2 className="mb-4 text-xl font-bold text-black">
        {getHeading(order.status)}
      </h2>

      <OrderInfoRows rows={rows} />
      <PickupCodeCard code={order.pickup_code} />
      <OrderStatusStepper status={order.status} />
    </div>
  );
}
