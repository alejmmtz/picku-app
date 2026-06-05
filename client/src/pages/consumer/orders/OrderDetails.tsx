import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useAxios } from "../../../providers/AxiosProvider";
import { getOrderById } from "../../../services/order.service";
import type { ConsumerOrder, OrderStatus } from "./orders.types";

import ArrowIcon from "../../../assets/arrow.svg?react";

const statusLabelMap: Record<OrderStatus, string> = {
  requested: "Pending",
  accepted: "Ongoing",
  declined: "Declined",
  delivering: "Ongoing",
  delivered: "Delivered",
};

const statusClassMap: Record<OrderStatus, string> = {
  requested:
    "inline-flex min-h-6 items-center justify-center rounded-full font-light border border-blue bg-blue/10 px-3 text-[13px] text-blue",
  accepted:
    "inline-flex min-h-6 items-center justify-center rounded-full font-light border border-yellow bg-yellow/10 px-3 text-[13px] text-yellow",
  declined:
    "inline-flex min-h-6 items-center justify-center rounded-full font-light border border-[#b4202f] bg-[#fff3f3] px-3 text-[13px] text-[#b4202f]",
  delivering:
    "inline-flex min-h-6 items-center justify-center rounded-full font-light border border-orange bg-orange/10 px-3 text-[13px] text-orange",
  delivered:
    "inline-flex min-h-6 items-center justify-center rounded-full font-light border border-orange bg-orange/10 px-3 text-[13px] text-orange",
};

const formatPrice = (price: number) =>
  `$${price.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;

const getOrderDescription = (order: ConsumerOrder) =>
  order.delivery_notes ||
  `${order.entrepreneur.category} order prepared by ${order.entrepreneur.name}.`;

const OrderDetails = () => {
  const api = useAxios();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const orderId = Number(params.id);

  const routedOrder =
    typeof location.state === "object" &&
    location.state !== null &&
    "order" in location.state
      ? (location.state.order as ConsumerOrder)
      : null;

  const [order, setOrder] = useState<ConsumerOrder | null>(routedOrder);
  const [feedbackMessage, setFeedbackMessage] = useState(
    routedOrder
      ? ""
      : Number.isFinite(orderId)
        ? "We couldn't load this order yet. Once the server processes it, it will appear here."
        : "This order is invalid or unavailable.",
  );

  useEffect(() => {
    let isMounted = true;

    if (!Number.isFinite(orderId)) {
      return;
    }

    const loadOrder = async () => {
      try {
        const data = await getOrderById(api, orderId);

        if (!isMounted) return;

        setOrder(data);
        setFeedbackMessage("");
      } catch {
        if (!isMounted) return;

        setFeedbackMessage(
          "We couldn't load this order yet. Once the server processes it, it will appear here.",
        );
      }
    };

    if (!routedOrder || routedOrder.id !== orderId) {
      void loadOrder();
    }

    return () => {
      isMounted = false;
    };
  }, [api, orderId, routedOrder]);

  const primaryItem = useMemo(() => order?.items[0] ?? null, [order]);

  if (!order || !primaryItem) {
    return (
      <main className="app-shell">
        <section className="app-screen flex flex-col items-center justify-center text-center">
          <p className="text-[18px] font-medium text-black">
            {feedbackMessage || "Order not found"}
          </p>
          <button
            type="button"
            onClick={() => navigate("/consumer/orders")}
            className="mt-4 rounded-full bg-orange px-6 py-2 text-white text-sm font-medium transition-all active:scale-95"
          >
            Go back to orders
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="relative min-h-screen w-full flex flex-col bg-background overflow-y-auto">
        <div className="relative h-96 w-full">
          <img
            className="h-full w-full object-cover"
            src={primaryItem.img || order.entrepreneur.img}
            alt={primaryItem.name}
          />
          <div className="absolute inset-0 bg-white/10" />

          <div className="absolute left-8 top-14">
            <button
              type="button"
              onClick={() => navigate("/consumer/orders")}
              className="flex items-center gap-1 rounded-lg font-light bg-white px-3 py-2 text-sm shadow-xs transition-all active:scale-95"
            >
              <ArrowIcon className="w-3 h-3" />
              <span>Go back</span>
            </button>
          </div>
        </div>

        <div className="-mt-10 relative z-10 flex-1 rounded-t-[28px] bg-background px-12 pt-8 pb-10 flex flex-col gap-8">
          <span className="absolute -top-5 right-12 inline-flex px-4 py-2 items-center justify-center rounded-xl bg-orange  text-sm font-semibold text-white shadow-sm">
            {primaryItem.quantity} items
          </span>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-[22px] font-medium text-black leading-tight">
                {primaryItem.name}
              </h2>
              <p className="mt-2 text-3xl font-semibold text-orange">
                {formatPrice(order.total_price)}
              </p>
            </div>

            <span className={statusClassMap[order.status]}>
              {statusLabelMap[order.status]}
            </span>
          </div>

          <div>
            <h2 className="text-[17px] font-medium mb-2 text-black">
              Delivery notes
            </h2>
            <p className="text-[15px] font-light leading-relaxed text-black/60">
              {getOrderDescription(order)}
            </p>
          </div>

          {order.cancel_reason ? (
            <div className="rounded-xl border border-[#b4202f]/30 bg-[#fff3f3]/50 p-4">
              <h3 className="text-[16px] font-medium text-[#b4202f] mb-1.5">
                Reason for order decline
              </h3>
              <p className="text-[15px] font-light leading-normal text-black/75">
                {order.cancel_reason}
              </p>
            </div>
          ) : null}

          {feedbackMessage ? (
            <p className="text-[13px] font-light text-black/40 mt-auto">
              {feedbackMessage}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
};

export default OrderDetails;
