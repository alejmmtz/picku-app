import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchOrders } from "./orders.api";
import type { ConsumerOrder, OrderStatus } from "./orders.types";

type OrderTab = "ongoing" | "delivered";

const statusLabelMap: Record<OrderStatus, string> = {
  requested: "Pending",
  accepted: "Ongoing",
  declined: "Declined",
  delivering: "Ongoing",
  delivered: "Delivered",
};

const statusClassMap: Record<OrderStatus, string> = {
  requested:
    "inline-flex min-h-6 items-center justify-center rounded-full border border-[#ecb100] bg-[#fff8da] px-3 text-[14px] text-[#ecb100]",
  accepted:
    "inline-flex min-h-6 items-center justify-center rounded-full border border-orange bg-[#fff0e8] px-3 text-[14px] text-orange",
  declined:
    "inline-flex min-h-6 items-center justify-center rounded-full border border-[#b4202f] bg-[#fff3f3] px-3 text-[14px] text-[#b4202f]",
  delivering:
    "inline-flex min-h-6 items-center justify-center rounded-full border border-orange bg-[#fff0e8] px-3 text-[14px] text-orange",
  delivered:
    "inline-flex min-h-6 items-center justify-center rounded-full border border-[#78aa38] bg-[#eef8df] px-3 text-[14px] text-[#78aa38]",
};

const emptyOrdersMessage =
  "En este momento no tienes pedidos. Si notas algo raro, ya lo estamos arreglando para ti.";

const formatPrice = (price: number) =>
  `$${price.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;

const getOrderImage = (order: ConsumerOrder) =>
  order.items[0]?.img ||
  order.entrepreneur.img ||
  "/resources/Image-SignUp-Consumer.svg";

const getOrderTitle = (order: ConsumerOrder) =>
  order.items[0]?.name || order.entrepreneur.name || "Order";

const getOrderSubtitle = (order: ConsumerOrder) =>
  order.delivery_notes || order.entrepreneur.category || "PickU order";

const getDistanceLabel = (order: ConsumerOrder) => {
  const distance = order.tracking.estimated_distance;

  if (distance !== null && Number.isFinite(distance)) {
    return `Near-${Math.round(distance)} mt.`;
  }

  return "Near-10 mt.";
};

const MyOrders = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<OrderTab>("ongoing");
  const [orders, setOrders] = useState<ConsumerOrder[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState(emptyOrdersMessage);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const data = await fetchOrders();

        if (!isMounted) return;

        setOrders(data);
        setFeedbackMessage(data.length > 0 ? "" : emptyOrdersMessage);
      } catch {
        if (!isMounted) return;

        setOrders([]);
        setFeedbackMessage(emptyOrdersMessage);
      }
    };

    void loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeTab === "delivered") {
      return orders.filter((order) => order.status === "delivered");
    }

    return orders.filter((order) => order.status !== "delivered");
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
              activeTab === "ongoing"
                ? "bg-[#f6ede7] font-semibold text-orange"
                : "bg-[#f6ede7] text-[rgba(27,27,27,0.38)]"
            }`}
            type="button"
            onClick={() => setActiveTab("ongoing")}
          >
            Ongoing
          </button>

          <button
            className={`rounded-full px-4 py-2 text-[15px] ${
              activeTab === "delivered"
                ? "bg-[#f6ede7] font-semibold text-orange"
                : "bg-[#f6ede7] text-[rgba(27,27,27,0.38)]"
            }`}
            type="button"
            onClick={() => setActiveTab("delivered")}
          >
            Delivered orders
          </button>
        </div>

        {feedbackMessage ? (
          <p className="mb-[14px] text-[13px] text-[#b4202f]">{feedbackMessage}</p>
        ) : null}

        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => {
            const item = order.items[0];

            return (
              <article
                key={order.id}
                className="grid cursor-pointer grid-cols-[102px_1fr] gap-3 rounded-2xl border border-[#ddd2ca] bg-[rgba(255,255,255,0.62)] p-3"
                onClick={() =>
                  navigate(`/consumer/orders/${order.id}`, {
                    state: { order },
                  })
                }
              >
                <img
                  className="h-[94px] w-[102px] rounded-[14px] bg-[#f2e7de] object-cover"
                  src={getOrderImage(order)}
                  alt={getOrderTitle(order)}
                />

                <div className="flex min-w-0 flex-col">
                  <div className="flex items-start justify-between gap-[10px]">
                    <div>
                      <h2 className="text-[16px] font-semibold">{getOrderTitle(order)}</h2>
                      <p className="mt-1 mb-1.5 text-[12px] text-[rgba(27,27,27,0.72)]">
                        {getOrderSubtitle(order)}
                      </p>
                    </div>

                    <span className="inline-flex h-7 min-w-[30px] items-center justify-center rounded-lg bg-orange px-1.5 text-[14px] text-white">
                      x{item?.quantity ?? 1}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[12px] text-[rgba(27,27,27,0.8)]">
                    <img className="h-[14px] w-[14px]" src="/icons/map-pin.svg" alt="" />
                    {getDistanceLabel(order)}
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
    </main>
  );
};

export default MyOrders;
