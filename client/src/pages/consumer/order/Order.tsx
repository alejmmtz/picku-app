import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import OrderFlowHeader from "./components/OrderFlowHeader";
import OrderMap from "./components/OrderMap";
import OrderSummaryCard from "./components/OrderSummaryCard";
import { useAxios } from "../../../providers/AxiosProvider";
import {
  getOrderById,
  getOrders,
} from "../../../services/order.service";
import type { OrderResponse } from "../../../types/order.types";
import Loader from "../../../components/common/Loader";

const isActiveOrder = (order: OrderResponse) =>
  order.status === "requested" ||
  order.status === "accepted" ||
  order.status === "delivering";

export default function OrderFlow() {
  const api = useAxios();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
            : "We could not load your current order.",
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
            {feedbackMessage || "Your current order will appear here."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/consumer/orders")}
            className="mt-6 rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white"
          >
            Go to orders
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-black sm:px-6 sm:py-6">
      <section className="relative h-dvh w-full overflow-hidden sm:mx-auto sm:w-100 ">
        <OrderMap />
        <OrderFlowHeader onBack={() => navigate("/consumer/orders")} />
        <OrderSummaryCard order={order} />
      </section>
    </main>
  );
}
