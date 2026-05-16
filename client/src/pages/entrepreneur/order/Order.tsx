import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import OrderFlowHeader from "./components/OrderFlowHeader";
import OrderMap from "./components/OrderMap";
import OrderSummaryCard from "./components/OrderSummaryCard";
import RequestedOrderDetails from "./components/RequestedOrderDetails";
import { useAxios } from "../../../providers/AxiosProvider";
import {
  getOrderById,
  getOrders,
  updateOrder,
} from "../../../services/order.service";
import type { OrderResponse } from "../../../types/order.types";

import Loader from "../../../components/common/LoaderEntrepreneur";

const isActiveOrder = (order: OrderResponse) =>
  order.status === "requested" ||
  order.status === "accepted" ||
  order.status === "delivering";

export default function Order() {
  const api = useAxios();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [pickupCode, setPickupCode] = useState("");
  const [declineReason, setDeclineReason] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orderIdParam = searchParams.get("orderId");
  const orderId = orderIdParam ? Number(orderIdParam) : null;

  useEffect(() => {
    let isMounted = true;

    const loadOrder = async () => {
      try {
        if (orderId !== null) {
          if (!Number.isFinite(orderId)) {
            setOrder(null);
            setFeedbackMessage("This order is not available.");
            return;
          }

          const data = await getOrderById(api, orderId);

          if (!isMounted) return;

          setOrder(data);
          setFeedbackMessage("");
          return;
        }

        const orders = await getOrders(api);

        if (!isMounted) return;

        const activeOrder = orders.find(isActiveOrder) ?? null;
        setOrder(activeOrder);
        setFeedbackMessage(
          activeOrder ? "" : "You do not have active orders right now.",
        );
      } catch (error) {
        if (!isMounted) return;

        setOrder(null);
        setFeedbackMessage(
          error instanceof Error
            ? error.message
            : "We could not load this order.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadOrder();

    return () => {
      isMounted = false;
    };
  }, [api, orderId]);

  const submitUpdate = async (
    payload: Parameters<typeof updateOrder>[2],
  ) => {
    if (!order) return;

    try {
      setIsSubmitting(true);
      setFeedbackMessage("");
      const updatedOrder = await updateOrder(api, order.id, payload);
      setOrder(updatedOrder);

      if (updatedOrder.status === "declined") {
        navigate("/entrepreneur/orders", { replace: true });
        return;
      }

      if (updatedOrder.status === "delivered") {
        navigate(`/entrepreneur/order-receipt?orderId=${updatedOrder.id}`, {
          replace: true,
        });
      }
    } catch (error) {
      setFeedbackMessage(
        error instanceof Error
          ? error.message
          : "We could not update the order.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = (reasonFromModal?: string) => {
  const reason =
    reasonFromModal?.trim() ||
    declineReason.trim() ||
    "Declined by entrepreneur.";

  void submitUpdate({
    status: "declined",
    cancel_reason: reason,
  });
};

  const handleComplete = () => {
    const normalizedPickupCode = pickupCode.trim().toUpperCase();

    if (!normalizedPickupCode) {
      setFeedbackMessage("Enter the pickup code before completing the order.");
      return;
    }

    setPickupCode(normalizedPickupCode);
    void submitUpdate({
      status: "delivered",
      pickup_code: normalizedPickupCode,
    });
  };

  if (isLoading) {
  return (
    <main className="min-h-screen bg-background text-black sm:px-6 sm:py-6">
      <section className="relative flex h-dvh w-full items-center justify-center overflow-hidden sm:mx-auto sm:w-100">
        <Loader message="Loading order..." />
      </section>
    </main>
  );
}

  if (!order) {
    return (
      <main className="min-h-screen bg-background text-black sm:px-6 sm:py-6">
        <section className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden px-13 text-center sm:mx-auto sm:w-100">
          <h1 className="text-2xl font-semibold">No active order</h1>
          <p className="mt-3 text-sm text-black/60">
            {feedbackMessage || "Incoming orders will appear here."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/entrepreneur/orders")}
            className="mt-6 rounded-xl bg-maroon px-5 py-3 text-sm font-semibold text-white"
          >
            Go to orders
          </button>
        </section>
      </main>
    );
  }

  if (order.status === "requested") {
    return (
      <RequestedOrderDetails
        order={order}
        isSubmitting={isSubmitting}
        feedbackMessage={feedbackMessage}
        onAccept={() => void submitUpdate({ status: "accepted" })}
        onDecline={handleDecline}
      />
    );
  }

  return (
    <main className="min-h-screen bg-background text-black sm:px-6 sm:py-6">
      <section className="relative h-dvh w-full overflow-hidden sm:mx-auto sm:w-100">
        <OrderMap />
        <OrderFlowHeader onBack={() => navigate("/entrepreneur/orders")} />
        <OrderSummaryCard
          order={order}
          pickupCode={pickupCode}
          declineReason={declineReason}
          isSubmitting={isSubmitting}
          onPickupCodeChange={setPickupCode}
          onDeclineReasonChange={setDeclineReason}
          onAccept={() => void submitUpdate({ status: "accepted" })}
          onDecline={handleDecline}
          onStartDelivery={() => void submitUpdate({ status: "delivering" })}
          onComplete={handleComplete}
        />

        {feedbackMessage ? (
          <p className="absolute left-6 right-6 top-18 z-30 rounded-xl bg-white/90 px-4 py-3 text-center text-sm text-[#8e3c2f] shadow-sm">
            {feedbackMessage}
          </p>
        ) : null}
      </section>
    </main>
  );
}
