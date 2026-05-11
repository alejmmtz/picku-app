import LocationMap from "../../../../components/common/LocationMap";
import type { OrderResponse } from "../../../../types/order.types";

type RequestedOrderDetailsProps = {
  order: OrderResponse;
  isSubmitting: boolean;
  feedbackMessage: string;
  onBack: () => void;
  onAccept: () => void;
  onDecline: () => void;
};

const formatPrice = (price: number) =>
  `$${price.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;

export default function RequestedOrderDetails({
  order,
  isSubmitting,
  feedbackMessage,
  onBack,
  onAccept,
  onDecline,
}: RequestedOrderDetailsProps) {
  const primaryItem = order.items[0];
  const imageSrc =
    primaryItem?.img || order.entrepreneur.img || "/resources/img-2-onboarding.svg";
  const itemName = primaryItem?.name || "Order";
  const quantity = primaryItem?.quantity ?? 1;

  return (
    <main className="flex min-h-screen justify-center bg-background font-sofia">
      <section className="min-h-screen w-full max-w-[430px] bg-background font-sofia">
        <div className="relative h-[300px] overflow-hidden px-[18px] pt-7">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={imageSrc}
            alt={itemName}
            onError={(event) => {
              event.currentTarget.src = "/resources/img-2-onboarding.svg";
            }}
          />

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,244,0.04),rgba(255,250,244,0.34))]" />

          <div className="relative z-10">
            <img className="mb-[38px] w-16" src="/logos/picku-logo.svg" alt="PickU" />

            <button
              className="mt-0 inline-flex min-h-10 items-center gap-2 rounded-[14px] bg-[rgba(255,255,255,0.86)] px-4 !font-sofia text-[16px] font-medium"
              type="button"
              onClick={onBack}
            >
              <img className="h-[18px] w-[18px]" src="/icons/arrow-left.svg" alt="" />
              <span>Orders</span>
            </button>
          </div>
        </div>

        <div className="relative z-20 -mt-5 rounded-t-[28px] bg-background px-[18px] pt-7 pb-9">
          <span className="absolute top-[-22px] right-[18px] inline-flex h-11 min-w-[54px] items-center justify-center rounded-[12px] bg-maroon px-[10px] font-sofia text-[20px] font-semibold text-white">
            x{quantity}
          </span>

          <div className="flex items-start justify-between gap-[14px]">
            <div>
              <h1 className="!font-sofia text-[22px] font-semibold text-black">
                {itemName}
              </h1>
            </div>

            <span className="inline-flex min-h-6 items-center justify-center rounded-full border border-[#ecb100] bg-[#fff8da] px-3 text-[14px] text-[#ecb100]">
              Pending
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="flex min-h-[44px] items-center justify-center rounded-[10px] border border-maroon px-3 text-center text-[14px] text-[rgba(27,27,27,0.82)]">
              <span className="truncate">{order.customer.name}</span>
            </div>

            <a
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] border border-maroon px-3 text-[14px] text-[rgba(27,27,27,0.82)]"
              href={`tel:${order.customer.phone}`}
            >
              <img className="h-[16px] w-[16px] opacity-55" src="/icons/phone.svg" alt="" />
              <span className="truncate">{order.customer.phone}</span>
            </a>
          </div>

          <p className="mt-6 text-[18px] text-black">
            Total:{" "}
            <strong className="text-[20px] font-semibold text-orange">
              {formatPrice(order.total_price)}
            </strong>
          </p>

          {order.delivery_notes?.trim() ? (
            <p className="mt-3 rounded-[12px] border border-[#ead9cf] bg-white px-4 py-3 text-[13px] leading-[1.35] text-[rgba(27,27,27,0.72)]">
              {order.delivery_notes}
            </p>
          ) : null}

          <div className="mt-6 overflow-hidden rounded-[18px] border border-[#ead9cf] bg-white p-2">
            <LocationMap className="relative h-[132px] w-full overflow-hidden rounded-[14px]" />

            <div className="flex items-center justify-between px-2 pt-1 text-[14px] text-[rgba(27,27,27,0.82)]">
              <span className="inline-flex items-center gap-1.5">
                <img className="h-[16px] w-[16px]" src="/icons/map-pin.svg" alt="" />
                Near 10 mt.
              </span>

              <span className="inline-flex items-center gap-1.5">
                <img className="h-[16px] w-[16px]" src="/icons/watch.svg" alt="" />
                3 min
              </span>
            </div>
          </div>

          {feedbackMessage ? (
            <p className="mt-4 text-[13px] text-[#b4202f]">{feedbackMessage}</p>
          ) : null}

          <div className="mt-8 flex flex-col gap-3">
            <button
              className="min-h-[52px] rounded-[12px] bg-maroon px-4 text-[16px] font-semibold text-white disabled:opacity-60"
              type="button"
              disabled={isSubmitting}
              onClick={onAccept}
            >
              {isSubmitting ? "Updating..." : "Confirm"}
            </button>

            <button
              className="min-h-[52px] rounded-[12px] border border-maroon bg-transparent px-4 text-[16px] font-semibold text-maroon disabled:opacity-60"
              type="button"
              disabled={isSubmitting}
              onClick={onDecline}
            >
              Decline
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
