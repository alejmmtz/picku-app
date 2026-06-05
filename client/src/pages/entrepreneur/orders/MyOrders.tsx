import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomNav from "../../../components/common/BottomNav";
import { useAxios } from "../../../providers/AxiosProvider";
import { getOrders } from "../../../services/order.service";
import type { OrderResponse, OrderStatus } from "../../../types/order.types";
import {
  applyOrderBroadcastPayload,
  useEntrepreneurOrdersRealtime,
  useOrdersListRealtime,
} from "../../../providers/OrdersRealtimeProvider";
import Loader from "../../../components/common/Loader";

import LogoEntrepreneur from "../../../assets/logo entrepeneur color.svg";

type OrderTab = "incoming" | "accepted" | "fulfilled";
type EntrepreneurProfile = { id: string };

const statusLabelMap: Record<OrderStatus, string> = {
  requested: "Pending",
  accepted: "Accepted",
  preparing: "Preparing",
  declined: "Declined",
  delivering: "Delivering",
  delivered: "Delivered",
};

const statusClassMap: Record<OrderStatus, string> = {
  requested:
    "inline-flex min-h-6 items-center justify-center rounded-full font-light border border-[#ecb100] bg-[#fff8da] px-3 text-[13px] text-[#ecb100]",
  accepted:
    "inline-flex min-h-6 items-center justify-center rounded-full font-light border border-blue-500 bg-blue-50 px-3 text-[13px] text-blue-500",
  preparing:
    "inline-flex min-h-6 items-center justify-center rounded-full font-light border border-maroon bg-[#f7e7eb] px-3 text-[13px] text-maroon",
  declined:
    "inline-flex min-h-6 items-center justify-center rounded-full font-light border border-[#b4202f] bg-[#fff3f3] px-3 text-[13px] text-[#b4202f]",
  delivering:
    "inline-flex min-h-6 items-center justify-center rounded-full font-light border border-maroon bg-[#f7e7eb] px-3 text-[13px] text-maroon",
  delivered:
    "inline-flex min-h-6 items-center justify-center rounded-full font-light border border-[#78aa38] bg-[#eef8df] px-3 text-[13px] text-[#78aa38]",
};

const formatOrderDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPrice = (price: number) =>
  `$${price.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;

const getOrderImage = (order: OrderResponse) =>
  order.items[0]?.img ||
  order.entrepreneur.img ||
  "/resources/img-2-onboarding.svg";

const getOrderTitle = (order: OrderResponse) =>
  order.items[0]?.name || order.entrepreneur.name || "Order";

const EntrepreneurOrders = () => {
  const api = useAxios();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<OrderTab>("incoming");
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const loadOrders = useCallback(
    async (isMounted: () => boolean = () => true) => {
      try {
        const [, data] = await Promise.all([
          api.get<EntrepreneurProfile>("/picku/api/entrepreneurs/me"),
          getOrders(api),
        ]);

        if (!isMounted()) return;
        setOrders(data);
        setFeedbackMessage("");
      } catch {
        if (!isMounted()) return;
        setOrders([]);
        setFeedbackMessage("We could not load your orders right now.");
      } finally {
        if (isMounted()) setLoading(false);
      }
    },
    [api],
  );

  useEffect(() => {
    let isMounted = true;
    void Promise.resolve().then(() => loadOrders(() => isMounted));
    return () => {
      isMounted = false;
    };
  }, [loadOrders]);

  useEntrepreneurOrdersRealtime(null, () => {
    void loadOrders();
  });

  useOrdersListRealtime(
    orders.map((order) => order.id),
    (payload) => {
      setOrders((current) =>
        current.map((order) =>
          order.id === payload.orderId
            ? applyOrderBroadcastPayload(order, payload)
            : order,
        ),
      );
    },
  );

  const filteredOrders = useMemo(() => {
    if (activeTab === "accepted") {
      return orders.filter((order) =>
        ["accepted", "preparing", "delivering"].includes(order.status),
      );
    }
    if (activeTab === "fulfilled") {
      return orders.filter((order) => order.status === "delivered");
    }
    return orders.filter((order) => order.status === "requested");
  }, [activeTab, orders]);

  return (
    <main className="app-shell">
      <section className="app-screen mb-16">
        <header className="flex items-center justify-between mb-6">
          <img
            src={LogoEntrepreneur}
            onClick={() => navigate("/consumer/home")}
            alt="PickU"
            className="w-16 cursor-pointer"
          />
        </header>

        <h2 className="mb-4 text-2xl font-semibold text-black">Your orders</h2>

        <div className="mb-6 flex w-full gap-2">
          {(["incoming", "accepted", "fulfilled"] as OrderTab[]).map((tab) => (
            <button
              key={tab}
              className={`flex-1 border text-center rounded-full py-2 text-sm transition-all capitalize ${
                activeTab === tab
                  ? "bg-maroon/10 font-medium text-maroon border-maroon"
                  : "bg-black/5 text-black/75 border-transparent"
              }`}
              type="button"
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center ">
            <Loader message="Loading your orders..." />
          </div>
        )}

        {!loading && !feedbackMessage && filteredOrders.length === 0 && (
          <div className="mt-28 flex flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-full items-center justify-center">
              <img
                className="block h-auto w-20"
                src="/resources/img-2-onboarding.svg"
                alt="No orders available"
              />
            </div>
            <p className="text-[18px] font-medium text-black">No orders yet!</p>
            <p className="mt-1 text-[15px] font-light text-black/50">
              Your orders will appear here.
            </p>
          </div>
        )}

        {!loading && (
          <div className="flex flex-col gap-5 bg-white">
            {filteredOrders.map((order) => {
              const item = order.items[0];
              return (
                <article
                  key={order.id}
                  className="app-card p-4 cursor-pointer transition-all duration-300 active:scale-[0.99]"
                  onClick={() =>
                    navigate(`/entrepreneur/order?orderId=${order.id}`)
                  }
                >
                  <div className="flex gap-4">
                    <img
                      className="h-24 w-24 rounded-xl object-cover shrink-0 bg-[#f2e7de]"
                      src={getOrderImage(order)}
                      alt={getOrderTitle(order)}
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-end justify-between gap-2">
                          <h3 className="text-lg font-medium text-black line-clamp-1">
                            {getOrderTitle(order)}
                          </h3>
                          <span className="rounded-md border text-sm px-2 py-1 font-light bg-maroon text-white whitespace-nowrap shrink-0">
                            x{item?.quantity ?? 1}
                          </span>
                        </div>

                        <p className="text-xs text-black/50 font-medium mb-1">
                          {formatOrderDate(order.created_at)}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className={statusClassMap[order.status]}>
                          {statusLabelMap[order.status]}
                        </span>
                        <strong className="text-lg font-semibold text-black">
                          {formatPrice(order.total_price)}
                        </strong>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <BottomNav variant="entrepreneur" />
    </main>
  );
};

export default EntrepreneurOrders;
