import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { OrderResponse } from "../../../../types/order.types";

import ArrowIcon from "../../../../assets/arrow.svg?react";
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
    primaryItem?.img ||
    order.entrepreneur.img ||
    "/resources/img-2-onboarding.svg";
  const itemName = primaryItem?.name || "Order";
  const quantity = primaryItem?.quantity ?? 1;

  const handleConfirmDecline = () => {
    if (!declineReason.trim()) {
      setDeclineError("Please write a reason.");
      return;
    }
    onDecline(declineReason.trim());
    setShowDeclineModal(false);
  };

  return (
    <main className="app-shell">
      <section className="relative h-screen w-full flex flex-col bg-background overflow-y-auto">
        <div className="relative h-96 w-full">
          <img
            src={imageSrc}
            alt={itemName}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-white/10" />

          <div className="absolute left-8 top-14">
            <button
              type="button"
              onClick={() => navigate("/consumer/orders")}
              className="flex items-center gap-1 rounded-lg font-light bg-white px-3 py-2 text-sm shadow-xs active:scale-95 transition-transform"
            >
              <ArrowIcon className="w-3 h-3" />
              <span>Back</span>
            </button>
          </div>
        </div>

        <div className="-mt-10 relative z-10 flex-1 rounded-t-[28px] bg-background px-12 pt-8 pb-10 flex flex-col justify-between gap-8">
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="min-w-0 flex-1">
                <h2 className="text-[22px] font-medium text-black leading-tight">
                  {itemName} <span className="font-bold">x{quantity}</span>
                </h2>
                <p className="mt-2 text-3xl font-semibold text-orange">
                  {formatPrice(order.total_price)}
                </p>
              </div>

              <span className="rounded-full border border-[#ecb100] bg-[#fff8da] px-4 py-1 text-[13px] font-light whitespace-nowrap text-[#ecb100]">
                Pending
              </span>
            </div>

            <div className="">
              <div className="flex flex-col gap-2 bg-orange border rounded-xl border-black/25 p-4">
                <div className="mb-2 text-white">@{order.customer.name}</div>
                <a
                  href={`tel:${order.customer.phone}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-maroon/20 bg-white p-4  font-semibold text-orange"
                >
                  <PhoneIcon className="w-4 h-4 fill-current" />
                  {order.customer.phone}
                </a>
              </div>
            </div>

            {order.delivery_notes?.trim() && (
              <div className="mt-6">
                <h3 className="text-[17px] font-medium mb-2 text-black">
                  Notes
                </h3>
                <p className="text-[15px] font-light leading-relaxed text-black/60 bg-black/5 p-4 rounded-xl">
                  {order.delivery_notes}
                </p>
              </div>
            )}
          </div>

          {feedbackMessage && (
            <p className="text-sm text-red-600">{feedbackMessage}</p>
          )}

          <div className="w-full flex flex-col gap-2 mt-auto">
            <button
              type="button"
              onClick={onAccept}
              className="w-full rounded-xl border text-sm text-white bg-maroon py-4 active:scale-95 transition-transform"
            >
              Accept Order
            </button>

            <button
              type="button"
              onClick={() => setShowDeclineModal(true)}
              className="w-full rounded-xl border text-sm text-maroon bg-background  border-maroon py-4 active:scale-95 transition-transform"
            >
              Decline
            </button>
          </div>
        </div>
      </section>

      {showDeclineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-8 backdrop-blur-[2px]">
          <div className="w-full max-w-[340px] rounded-2xl bg-background p-6 shadow-xl">
            <h2 className="text-[22px] font-semibold text-black">
              Decline order?
            </h2>
            <textarea
              value={declineReason}
              onChange={(e) => {
                setDeclineReason(e.target.value);
                setDeclineError("");
              }}
              placeholder="Write a reason..."
              className="mt-5 h-[110px] w-full resize-none rounded-xl border border-maroon bg-transparent px-4 py-3 text-[14px] outline-none"
            />
            {declineError && (
              <p className="mt-2 text-[13px] text-red-600">{declineError}</p>
            )}
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowDeclineModal(false)}
                className="flex-1 py-3 rounded-xl border border-black/15 text-[15px]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecline}
                className="flex-1 py-3 rounded-xl bg-maroon text-[15px] text-white"
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
