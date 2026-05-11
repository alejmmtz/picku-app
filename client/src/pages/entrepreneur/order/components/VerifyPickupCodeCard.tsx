import type { OrderStatus } from "../../../../types/order.types";
import AppIcon from "./icons";

type VerifyPickupCodeCardProps = {
  status: OrderStatus;
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

export default function VerifyPickupCodeCard({
  status,
  pickupCode,
  declineReason,
  isSubmitting,
  onPickupCodeChange,
  onDeclineReasonChange,
  onAccept,
  onDecline,
  onStartDelivery,
  onComplete,
}: VerifyPickupCodeCardProps) {
  const isRequested = status === "requested";
  const isAccepted = status === "accepted";
  const isDelivering = status === "delivering";
  const isTerminal = status === "delivered" || status === "declined";

  return (
    <div className="rounded-xl border border-black/25 bg-background p-4">
      <div className=" flex items-center gap-2">
        <AppIcon name="smartphone" className="h-5 w-5 text-orange" />
        <p className="text-lg text-black">Order Actions</p>
      </div>

      {isRequested ? (
        <>
          <p className="mb-4 font-light text-black">
            Confirm this order or add a reason if you need to decline it.
          </p>

          <textarea
            value={declineReason}
            onChange={(event) => onDeclineReasonChange(event.target.value)}
            placeholder="Optional decline reason"
            className="mb-4 min-h-[92px] w-full resize-none rounded-xl border border-maroon px-4 py-3 text-sm text-black outline-none placeholder:text-black/25"
          />

          <div className="flex gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onAccept}
              className="flex-1 rounded-xl bg-maroon px-4 py-4 text-base font-semibold text-background transition-transform active:scale-[0.99] disabled:opacity-60"
            >
              Accept order
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={onDecline}
              className="flex-1 rounded-xl border border-maroon px-4 py-4 text-base font-semibold text-maroon transition-transform active:scale-[0.99] disabled:opacity-60"
            >
              Decline
            </button>
          </div>
        </>
      ) : null}

      {isAccepted ? (
        <>
          <p className="mb-4 font-light text-black">
            Mark the order as in delivery when it leaves your shop.
          </p>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onStartDelivery}
            className="w-full rounded-xl bg-maroon px-4 py-4 text-base font-semibold text-background transition-transform active:scale-[0.99] disabled:opacity-60"
          >
            Start delivery
          </button>
        </>
      ) : null}

      {isDelivering ? (
        <>
          <p className="mb-4 font-light text-black">
            Ask the customer for the pickup code to complete the order.
          </p>

          <input
            type="text"
            value={pickupCode}
            onChange={(event) => onPickupCodeChange(event.target.value)}
            placeholder="Enter code (e.g, E456)"
            className="mb-4 h-12 w-full rounded-xl border border-maroon px-4 text-sm text-black outline-none placeholder:text-black/25"
          />

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onComplete}
            className="w-full rounded-xl bg-maroon px-4 py-4 text-base font-semibold text-background transition-transform active:scale-[0.99] disabled:opacity-60"
          >
            Verify & Complete Order
          </button>
        </>
      ) : null}

      {isTerminal ? (
        <p className="font-light text-black">
          This order no longer requires actions from you.
        </p>
      ) : null}
    </div>
  );
}
