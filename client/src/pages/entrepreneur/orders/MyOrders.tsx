import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomNav from "../../../components/common/BottomNav";
import { useAxios } from "../../../providers/AxiosProvider";
import { getOrders } from "../../../services/order.service";
import type { OrderResponse, OrderStatus } from "../../../types/order.types";

type OrderTab = "incoming" | "accepted";

const statusLabelMap: Record<OrderStatus, string> = {
  requested: "Pending",
  accepted: "Accepted",
  declined: "Declined",
  delivering: "Delivering",
  delivered: "Delivered",
};

const statusClassMap: Record<OrderStatus, string> = {
  requested:
    "inline-flex min-h-6 items-center justify-center rounded-full border border-[#ecb100] bg-[#fff8da] px-3 text-[14px] text-[#ecb100]",
  accepted:
    "inline-flex min-h-6 items-center justify-center rounded-full border border-[#78aa38] bg-[#eef8df] px-3 text-[14px] text-[#78aa38]",
  declined:
    "inline-flex min-h-6 items-center justify-center rounded-full border border-[#b4202f] bg-[#fff3f3] px-3 text-[14px] text-[#b4202f]",
  delivering:
    "inline-flex min-h-6 items-center justify-center rounded-full border border-maroon bg-[#f7e7eb] px-3 text-[14px] text-maroon",
  delivered:
    "inline-flex min-h-6 items-center justify-center rounded-full border border-[#78aa38] bg-[#eef8df] px-3 text-[14px] text-[#78aa38]",
};

const emptyMessages: Record<OrderTab, string> = {
  incoming: "No incoming orders yet. New requests will appear here as soon as they arrive.",
  accepted: "No accepted orders right now. Accepted and delivering orders will appear here.",
};

const formatPrice = (price: number) =>
  `$${price.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;

const getOrderImage = (order: OrderResponse) =>
  order.items[0]?.img ||
  order.entrepreneur.img ||
  "/resources/img-2-onboarding.svg";

const getOrderTitle = (order: OrderResponse) =>
  order.items[0]?.name || order.entrepreneur.name || "Order";

const getOrderSubtitle = (order: OrderResponse) =>
  order.delivery_notes?.trim() || order.customer.phone || "Campus pickup";

const EntrepreneurOrders = () => {
  const api = useAxios();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<OrderTab>("incoming");
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const data = await getOrders(api);

        if (!isMounted) return;

        setOrders(data);
        setFeedbackMessage("");
      } catch {
        if (!isMounted) return;

        setOrders([]);
        setFeedbackMessage(
          "We could not load your orders right now. Please try again in a moment.",
        );
      }
    };

    void loadOrders();

    return () => {
      isMounted = false;
    };
  }, [api]);

  const filteredOrders = useMemo(() => {
    if (activeTab === "accepted") {
      return orders.filter(
        (order) =>
          order.status === "accepted" || order.status === "delivering",
      );
    }

    return orders.filter((order) => order.status === "requested");
  }, [activeTab, orders]);

  return (
    <main className="flex min-h-screen justify-center font-sofia">
      <section className="relative min-h-screen w-full max-w-[430px] px-[18px] pt-7 pb-[110px] font-sofia">
        <img className="mb-[38px] w-16" src="/logos/picku-logo.svg" alt="PickU" />

        <h1 className="mb-[18px] !font-sofia text-[24px] font-semibold leading-[1.1] text-black">
          Your orders
        </h1>

        <div className="mb-6 flex gap-3">
          <button
            className={`rounded-full px-4 py-2 text-[15px] ${
              activeTab === "incoming"
                ? "bg-[#f4e6e9] font-semibold text-maroon"
                : "bg-[#f4e6e9] text-[rgba(27,27,27,0.38)]"
            }`}
            type="button"
            onClick={() => setActiveTab("incoming")}
          >
            Incoming
          </button>

          <button
            className={`rounded-full px-4 py-2 text-[15px] ${
              activeTab === "accepted"
                ? "bg-[#f4e6e9] font-semibold text-maroon"
                : "bg-[#f4e6e9] text-[rgba(27,27,27,0.38)]"
            }`}
            type="button"
            onClick={() => setActiveTab("accepted")}
          >
            Accepted orders
          </button>
        </div>

        {feedbackMessage ? (
          <p className="mb-[14px] text-[13px] text-[#b4202f]">{feedbackMessage}</p>
        ) : null}

        {!feedbackMessage && filteredOrders.length === 0 ? (
          <p className="mb-[14px] text-[13px] text-[rgba(27,27,27,0.58)]">
            {emptyMessages[activeTab]}
          </p>
        ) : null}

        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => {
            const item = order.items[0];

            return (
              <article
                key={order.id}
                className="grid cursor-pointer grid-cols-[102px_1fr] gap-3 rounded-2xl border border-[#ddd2ca] bg-[rgba(255,255,255,0.62)] p-3"
                onClick={() => navigate(`/entrepreneur/order?orderId=${order.id}`)}
              >
                <img
                  className="h-[94px] w-[102px] rounded-[14px] bg-[#f2e7de] object-cover"
                  src={getOrderImage(order)}
                  alt={getOrderTitle(order)}
                  onError={(event) => {
                    event.currentTarget.src = "/resources/img-2-onboarding.svg";
                  }}
                />

                <div className="flex min-w-0 flex-col">
                  <div className="flex items-start justify-between gap-[10px]">
                    <div>
                      <h2 className="text-[16px] font-semibold">{getOrderTitle(order)}</h2>
                      <p className="mt-1 mb-1.5 text-[12px] text-[rgba(27,27,27,0.72)]">
                        {getOrderSubtitle(order)}
                      </p>
                    </div>

                    <span className="inline-flex h-7 min-w-[30px] items-center justify-center rounded-lg bg-maroon px-1.5 text-[14px] text-white">
                      x{item?.quantity ?? 1}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[12px] text-[rgba(27,27,27,0.8)]">
                    <img className="h-[14px] w-[14px]" src="/icons/map-pin.svg" alt="" />
                    {order.delivery_notes?.trim() ? "Pickup details added" : "Campus pickup"}
                  </span>

                  <div className="mt-auto flex items-end justify-between gap-3">
                    <span className={statusClassMap[order.status]}>
                      {statusLabelMap[order.status]}
                    </span>

                    <strong className="text-[18px] font-semibold text-black">
                      {formatPrice(order.total_price)}
                    </strong>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <BottomNav variant="entrepreneur" />
    </main>
  );
};

export default EntrepreneurOrders;
