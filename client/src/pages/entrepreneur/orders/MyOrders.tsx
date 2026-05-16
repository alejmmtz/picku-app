import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomNav from "../../../components/common/BottomNav";
import { useAxios } from "../../../providers/AxiosProvider";
import { getOrders } from "../../../services/order.service";
import type { OrderResponse, OrderStatus } from "../../../types/order.types";

import LogoEntrepreneur from "../../../assets/logo entrepeneur color.svg";
import MapPinIcon from "../../../assets/map-pin.svg?react";

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
    "inline-flex min-h-6 items-center justify-center rounded-full border border-[#5ba7ff] bg-[#edf5ff] text-[#3478c9] px-3 text-[14px]",
  declined:
    "inline-flex min-h-6 items-center justify-center rounded-full border border-[#b4202f] bg-[#fff3f3] px-3 text-[14px] text-[#b4202f]",
  delivering:
    "inline-flex min-h-6 items-center justify-center rounded-full border border-maroon bg-[#f7e7eb] px-3 text-[14px] text-maroon",
  delivered:
    "inline-flex min-h-6 items-center justify-center rounded-full border border-[#78aa38] bg-[#eef8df] px-3 text-[14px] text-[#78aa38]",
};

const emptyMessages: Record<OrderTab, string> = {
  incoming: "No incoming orders yet.",
  accepted: "No accepted orders right now.",
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
      <section className="w-full max-w-[430px] min-h-screen px-13 pt-16 pb-[220px]">
        <header className="flex items-center justify-between mb-10 mt-2">
          <img src={LogoEntrepreneur} alt="PickU" className="w-[72px] " />
        </header>

        <h1 className="mb-[20px] !font-sofia text-[24px] font-semibold leading-[1.1] text-black">
          Your orders
        </h1>

      {/*incoming or accepted*/}

        <div className="mb-8 flex gap-3">
          <button
            className={`rounded-full px-4 py-2 text-[15px] ${
              activeTab === "incoming"
                ? "bg-[#f4e6e9] font-medium text-maroon"
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
                ? "bg-[#f4e6e9] font-medium text-maroon"
                : "bg-[#f4e6e9] text-[rgba(27,27,27,0.38)]"
            }`}
            type="button"
            onClick={() => setActiveTab("accepted")}
          >
            Accepted orders
          </button>
        </div>

        {feedbackMessage ? (
          <p className="mb-[14px] font-regular text-[15px] text-[rgba(27,27,27,0.58)]">{feedbackMessage}</p>
        ) : null}

        {!feedbackMessage && filteredOrders.length === 0 ? (
          <p className="mb-[14px] ml-2 font-regular text-[15px] text-[rgba(27,27,27,0.58)]">
            {emptyMessages[activeTab]}
          </p>
        ) : null}

        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => {
            const item = order.items[0];

            {/*orders card*/}

            return (
              <article
                key={order.id}
                className="grid cursor-pointer grid-cols-[102px_1fr] gap-3 rounded-2xl border border-[#DCD6D3] p-3"
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
                      <h2 className="text-[16px] font-medium">{getOrderTitle(order)}</h2>
                      <p className="mt-1 mb-1 text-[13px] text-black font-light">
                        {getOrderSubtitle(order)}
                      </p>
                    </div>

                    <span className="inline-flex h-7 min-w-[30px] items-center justify-center font-medium rounded-lg bg-maroon px-1.5 text-[14px] text-white">
                      x{item?.quantity ?? 1}
                    </span>
                  </div>

                  <span className="inline-flex mb-1 items-center gap-1 text-[13px] font-light">
                    <MapPinIcon className="h-[17px] w-[17px] shrink-0" />
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
