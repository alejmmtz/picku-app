import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAxios } from "../../../providers/AxiosProvider";
import { getOrders } from "../../../services/order.service";
import type { ConsumerOrder, OrderStatus } from "./orders.types";
import BottomNav from "../../../components/common/BottomNav";
import {
  applyOrderBroadcastPayload,
  useOrdersListRealtime,
} from "../../../providers/OrdersRealtimeProvider";
import Loader from "../../../components/common/Loader";

import ShoppingCartIcon from "../../../assets/shopping cart consumer.svg?react";
import LogoConsumer from "../../../assets/logo consumer.png";

type OrderTab = "ongoing" | "delivered" | "declined";

const statusLabelMap: Record<OrderStatus, string> = {
  requested: "Pending",
  accepted: "Ongoing",
  preparing: "Preparing",
  declined: "Declined",
  delivering: "Ongoing",
  delivered: "Delivered",
};

const statusClassMap: Record<OrderStatus, string> = {
  requested:
    "inline-flex min-h-6 items-center justify-center rounded-full font-light border border-blue bg-blue/10 px-3 text-[13px] text-blue",
  accepted:
    "inline-flex min-h-6 items-center justify-center rounded-full font-light border border-yellow bg-yellow/10 px-3 text-[13px] text-yellow",
  preparing:
    "inline-flex min-h-6 items-center justify-center rounded-full font-light border border-orange bg-orange/10 px-3 text-[13px] text-orange",
  declined:
    "inline-flex min-h-6 items-center justify-center rounded-full font-light border border-[#b4202f] bg-[#fff3f3] px-3 text-[13px] text-[#b4202f]",
  delivering:
    "inline-flex min-h-6 items-center justify-center rounded-full font-light border border-orange bg-orange/10 px-3 text-[13px] text-orange",
  delivered:
    "inline-flex min-h-6 items-center justify-center rounded-full font-light border border-orange bg-orange/10 px-3 text-[13px] text-orange",
};

const emptyOrdersMessage = "No orders yet. We're working on it!";

const getOrderImage = (order: ConsumerOrder) =>
  order.items[0]?.img ||
  order.entrepreneur.img ||
  "/resources/Image-SignUp-Consumer.svg";

const getOrderTitle = (order: ConsumerOrder) =>
  order.items[0]?.name || order.entrepreneur.name || "Order";

const getOrderSubtitle = (order: ConsumerOrder) =>
  order.delivery_notes || order.entrepreneur.name || "PickU order";

const MyOrders = () => {
  const api = useAxios();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<OrderTab>("ongoing");
  const [orders, setOrders] = useState<ConsumerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState(emptyOrdersMessage);

  useEffect(() => {
    let isMounted = true;

    const loadInitialOrders = async () => {
      try {
        const data = await getOrders(api);

        if (!isMounted) return;

        setOrders(data);
        setFeedbackMessage(data.length > 0 ? "" : emptyOrdersMessage);
      } catch {
        if (!isMounted) return;

        setOrders([]);
        setFeedbackMessage(emptyOrdersMessage);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadInitialOrders();

    return () => {
      isMounted = false;
    };
  }, [api]);

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
    if (activeTab === "delivered") {
      return orders.filter((order) => order.status === "delivered");
    }

    if (activeTab === "declined") {
      return orders.filter((order) => order.status === "declined");
    }

    return orders.filter(
      (order) =>
        order.status === "requested" ||
        order.status === "accepted" ||
        order.status === "preparing" ||
        order.status === "delivering",
    );
  }, [activeTab, orders]);

  return (
    <main className="app-shell">
      <section className="app-screen mb-24">
        <header className="flex items-center justify-between mb-8 h-6">
          <img
            src={LogoConsumer}
            onClick={() => navigate("/consumer/home")}
            alt="PickU"
            className="w-16 cursor-pointer"
          />
          <button
            type="button"
            onClick={() => navigate("/consumer/cart")}
            className="flex items-center justify-center"
          >
            <ShoppingCartIcon className="w-6 h-6" />
          </button>
        </header>

        <h2 className="mb-4 text-2xl font-semibold text-black">Your orders</h2>

        <div className="mb-6 flex w-full gap-2">
          <button
            className={`flex-1 border text-center rounded-full py-2 text-sm transition-all ${
              activeTab === "ongoing"
                ? "bg-orange/5 font-medium text-orange border-orange"
                : "bg-black/5 text-black/75 border-transparent"
            }`}
            type="button"
            onClick={() => setActiveTab("ongoing")}
          >
            Ongoing
          </button>

          <button
            className={`flex-1 border text-center rounded-full py-2 text-sm transition-all ${
              activeTab === "delivered"
                ? "bg-orange/5 font-medium text-orange border-orange"
                : "bg-black/5 text-black/75 border-transparent"
            }`}
            type="button"
            onClick={() => setActiveTab("delivered")}
          >
            Delivered
          </button>

          <button
            className={`flex-1 border text-center rounded-full py-2 text-sm transition-all ${
              activeTab === "declined"
                ? "bg-orange/5 font-medium text-orange border-orange"
                : "bg-black/5 text-black/75 border-transparent"
            }`}
            type="button"
            onClick={() => setActiveTab("declined")}
          >
            Cancelled
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center ">
            <Loader message="Loading your orders..." />
          </div>
        )}

        {!loading && !feedbackMessage && filteredOrders.length === 0 ? (
          <div className="mt-24 flex flex-col items-center justify-center text-center">
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
        ) : null}

        {!loading && (
          <div className="flex flex-col gap-5 bg-white">
            {filteredOrders.map((order) => {
              const item = order.items[0];

              return (
                <article
                  key={order.id}
                  className="app-card p-4 cursor-pointer transition-all duration-300 active:scale-[0.99]"
                  onClick={() => {
                    if (
                      order.status === "requested" ||
                      order.status === "accepted" ||
                      order.status === "delivering"
                    ) {
                      navigate(`/consumer/order?orderId=${order.id}`);
                      return;
                    }

                    navigate(`/consumer/orders/${order.id}`, {
                      state: { order },
                    });
                  }}
                >
                  <div className="flex gap-4">
                    <img
                      className="h-30 w-30 rounded-xl object-cover shrink-0 bg-[#f2e7de]"
                      src={getOrderImage(order)}
                      alt={getOrderTitle(order)}
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-end justify-between gap-2">
                          <h3 className="text-lg font-medium text-black line-clamp-1 ">
                            {getOrderTitle(order)}
                          </h3>
                          <span className="rounded-md border text-sm px-2 py-1 font-light bg-orange text-white  whitespace-nowrap shrink-0">
                            x{item?.quantity ?? 1}
                          </span>
                        </div>

                        <p className="text-[15px] font-light text-black/60 line-clamp-1">
                          {getOrderSubtitle(order)}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className={statusClassMap[order.status]}>
                          {statusLabelMap[order.status]}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <BottomNav variant="consumer" />
    </main>
  );
};

export default MyOrders;
