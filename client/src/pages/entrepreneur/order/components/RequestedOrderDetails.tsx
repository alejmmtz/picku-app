import { useNavigate } from "react-router-dom";
import LocationMap from "../../../../components/common/LocationMap";
import type { OrderResponse } from "../../../../types/order.types";
import { useState } from "react";

import ArrowIcon from "../../../../assets/arrow.svg?react";
import MapPinIcon from "../../../../assets/map-pin.svg?react";
import ClockIcon from "../../../../assets/clock.svg?react";
import PhoneIcon from "../../../../assets/phone.svg?react";

type RequestedOrderDetailsProps = {
  order: OrderResponse;
  isSubmitting: boolean;
  feedbackMessage: string;
  onAccept: () => void;
  onDecline: (reason: string) => void;
};

const formatPrice = (price: number) =>
  `$${price.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;



export default function RequestedOrderDetails({
  order,
  isSubmitting,
  feedbackMessage,
  onAccept,
  onDecline,
}: RequestedOrderDetailsProps) {
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [declineError, setDeclineError] = useState("");
  const navigate = useNavigate();
  const primaryItem = order.items[0];
  const imageSrc =
    primaryItem?.img || order.entrepreneur.img || "/resources/img-2-onboarding.svg";
  const itemName = primaryItem?.name || "Order";
  const quantity = primaryItem?.quantity ?? 1;

  const handleConfirmDecline = () => {
  if (!declineReason.trim()) {
    setDeclineError("Please write a reason.");
    return;
  }

  onDecline(declineReason.trim());
  setShowDeclineModal(false);
  setDeclineReason("");
  setDeclineError("");
};

  return (
    <main className="flex min-h-screen justify-center bg-background font-sofia">
      <section className="min-h-screen w-full max-w-[430px] bg-background font-sofia">
        <div className="relative h-[324px] overflow-hidden px-13 pt-7">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={imageSrc}
            alt={itemName}
            onError={(event) => {
              event.currentTarget.src = "/resources/img-2-onboarding.svg";
            }}
          />

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,244,0.04),rgba(255,250,244,0.34))]" />

          <div className="relative z-10 left-[-20px] top-10">

            <button
            type="button"
            onClick={() => navigate("/consumer/orders")}
            className="flex items-center gap-1 rounded-full font-regular bg-white/80 px-3 ml-4 py-1 text-[13px] shadow-sm"
          >
            <ArrowIcon className="w-3 h-3" />
            <span>Orders</span>
          </button>
          </div>
        </div>

        <div className="relative z-20 -mt-5 rounded-t-[28px] bg-background px-13 pt-7">
          <span className="absolute top-[-22px] right-[50px] inline-flex h-11 min-w-[54px] items-center justify-center rounded-[10px] bg-maroon px-[10px] font-medium text-[22px] font-sofia text-white">
            x{quantity}
          </span>

          <div className="flex items-start justify-between gap-[14px] mt-4">
            <div>
              <h1 className="!font-sofia text-[22px] font-medium text-black">
                {itemName}
              </h1>
            </div>

            <span className="inline-flex min-h-7 items-center justify-center rounded-full border border-[#ecb100] bg-[#fff8da] px-3 text-[14px] text-[#ecb100]">
              Pending
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="flex min-h-[44px] items-center justify-center rounded-[10px] border border-maroon px-3 text-center  text-[rgba(27,27,27,0.82)]">
              <span className="truncate">{order.customer.name}</span>
            </div>

            <a
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] border border-maroon px-3 text-[rgba(27,27,27,0.82)]"
              href={`tel:${order.customer.phone}`}
            >
              <PhoneIcon className="h-[16px] w-[16px]" />
              <span className="truncate">{order.customer.phone}</span>
            </a>
          </div>

          <p className="mt-3 font-light text-[18px] text-black">
            Total:{" "}
            <strong className="text-[25px] font-semibold text-orange">
              {formatPrice(order.total_price)}
            </strong>
          </p>

          {order.delivery_notes?.trim() ? (
            <p className="mt-3 rounded-[12px] border border-[#ead9cf] px-4 py-3 text-[13px] leading-[1.35] text-[rgba(27,27,27,0.72)]">
              {order.delivery_notes}
            </p>
          ) : null}

          <div className="mt-6 overflow-hidden rounded-[18px] p-2">
            <LocationMap className="relative h-[132px] w-full overflow-hidden rounded-[14px]" />

            <div className="flex items-center justify-between px-2 pt-1 text-[14px] text-[rgba(27,27,27,0.82)]">
            <span className="inline-flex items-center gap-1.5">
              <MapPinIcon className="h-[16px] w-[16px]" />
              Near 10 mt.
            </span>

            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-[16px] w-[16px]" />
              3 min
            </span>
          </div>
          </div>

          {feedbackMessage ? (
            <p className="mt-4 text-[13px] text-[#b4202f]">{feedbackMessage}</p>
          ) : null}

          <div className="mt-8 flex flex-col gap-3">
            <button
              className="min-h-[52px] rounded-[12px] bg-maroon px-4 text-[16px] font-light text-white disabled:opacity-60"
              type="button"
              disabled={isSubmitting}
              onClick={onAccept}
            >
              {isSubmitting ? "Updating..." : "Confirm"}
            </button>

            <button
              className="min-h-[52px] rounded-[12px] border border-maroon bg-transparent px-4 text-[16px] font-light text-maroon disabled:opacity-60"
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowDeclineModal(true)}
            >
              Decline
            </button>
          </div>
        </div>

        {/*decline modal */}

      </section>
      {showDeclineModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-8 backdrop-blur-[2px]">
    <div className="w-full max-w-[340px] rounded-[24px] bg-background p-6 shadow-xl">
      <h2 className="text-[22px] font-semibold text-black">
        Decline order?
      </h2>

      <p className="mt-2 text-[15px] font-light leading-tight text-[#7A716D]">
        Let the customer know why this order cannot be accepted.
      </p>

      <textarea
        value={declineReason}
        onChange={(event) => {
          setDeclineReason(event.target.value);
          setDeclineError("");
        }}
        placeholder="Write a short reason..."
        className="mt-5 h-[110px] w-full resize-none rounded-[12px] border border-maroon bg-transparent px-4 py-3 text-[14px] font-light outline-none placeholder:text-[#9B928E]"
      />

      {declineError && (
        <p className="mt-2 text-[13px] text-[#b4202f]">
          {declineError}
        </p>
      )}

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={() => {
            setShowDeclineModal(false);
            setDeclineReason("");
            setDeclineError("");
          }}
          className="h-[50px] flex-1 rounded-[12px] border border-[#DCD6D3] text-[15px]"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleConfirmDecline}
          className="h-[50px] flex-1 rounded-[12px] bg-maroon text-[15px] text-white disabled:opacity-60"
        >
          Send
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}
