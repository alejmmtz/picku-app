import type { OrderResponse } from "../../../../types/order.types";
import ReceiptRow from "./ReceiptRow";

type ReceiptCardProps = {
  order: OrderResponse;
};

const formatCurrency = (value: number) =>
  `$${value.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("es-CO");

export default function ReceiptCard({ order }: ReceiptCardProps) {
  const firstItem = order.items[0];

  return (
    <section className="relative rounded-xl border border-black/25 bg-background p-8">
      <div className="absolute left-0 top-[50%] h-12 w-6 -translate-x-1/2 -translate-y-1/2 rounded-r-full border-r border-black/25 bg-background" />
      <div className="absolute right-0 top-[50%] h-12 w-6 translate-x-1/2 -translate-y-1/2 rounded-l-full border-l border-black/25 bg-background" />

      <div className="mb-8 flex items-baseline justify-between">
        <h2 className="text-3xl font-semibold text-black">Order receipt</h2>
        <span className="text-lg text-black/25">#{String(order.id).padStart(4, "0")}</span>
      </div>

      <div className="grid gap-2">
        <ReceiptRow label="Name:" value={order.customer.name} />
        <ReceiptRow label="Amount:" value={formatCurrency(order.total_price)} accent />
      </div>

      <div className="my-16 border-t-2 border-dashed border-black/25" />

      <div className="mb-8 grid gap-2">
        <ReceiptRow label="Product:" value={firstItem?.name ?? "Order"} />
        <ReceiptRow label="Date:" value={formatDate(order.created_at)} accent />
        <div className="flex items-center justify-between ">
          <span className="text-black">Status:</span>
          <span className="inline-flex w-fit items-center rounded-full border border-[#b8c77f] bg-[#edf3cf] px-3 py-1 text-sm font-medium text-[#6c7c24]">
            {order.status === "delivered" ? "Delivered" : "Completed"}
          </span>
        </div>
      </div>
    </section>
  );
}
