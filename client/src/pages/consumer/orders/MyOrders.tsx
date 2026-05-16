import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAxios } from "../../../providers/AxiosProvider";
import { getOrders } from "../../../services/order.service";
import type { ConsumerOrder, OrderStatus } from "./orders.types";
import BottomNav from "../../../components/common/BottomNav";

import LogoConsumer from "../../../assets/logo consumer.png";
import MapPinIcon from "../../../assets/map-pin.svg?react";

type OrderTab = "ongoing" | "delivered" | "declined";

const statusLabelMap: Record<OrderStatus, string> = {
  requested: "Pending",
  accepted: "Ongoing",
  declined: "Declined",
  delivering: "Ongoing",
  delivered: "Delivered",
};

const statusClassMap: Record<OrderStatus, string> = {
  requested:
    "inline-flex min-h-6 items-center justify-center rounded-full font-regular border border-[#ecb100] bg-[#fff8da] px-3 text-[13px] text-[#ecb100]",
  accepted:
    "inline-flex min-h-6 items-center justify-center rounded-full font-regular border border-orange bg-[#fff0e8] px-3 text-[13px] text-orange",
  declined:
    "inline-flex min-h-6 items-center justify-center rounded-full font-regular border border-[#b4202f] bg-[#fff3f3] px-3 text-[13px] text-[#b4202f]",
  delivering:
    "inline-flex min-h-6 items-center justify-center rounded-full font-regular border border-orange bg-[#fff0e8] px-3 text-[13px] text-orange",
  delivered:
    "inline-flex min-h-6 items-center justify-center rounded-full font-regular border border-[#78aa38] bg-[#eef8df] px-3 text-[13px] text-[#78aa38]",
};

const emptyOrdersMessage =
  "No orders yet. We're working on it!";

const formatPrice = (price: number) =>
  `$${price.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;

const getOrderImage = (order: ConsumerOrder) =>
  order.items[0]?.img ||
  order.entrepreneur.img ||
  "/resources/Image-SignUp-Consumer.svg";

const getOrderTitle = (order: ConsumerOrder) =>
  order.items[0]?.name || order.entrepreneur.name || "Order";

const getOrderSubtitle = (order: ConsumerOrder) =>
  order.delivery_notes || order.entrepreneur.name || "PickU order";

const getDistanceLabel = (order: ConsumerOrder) => {
  return order.delivery_notes?.trim() ? "Pickup details added" : "Campus pickup";
};

const MyOrders = () => {
  const api = useAxios();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<OrderTab>("ongoing");
  const [orders, setOrders] = useState<ConsumerOrder[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState(emptyOrdersMessage);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const data = await getOrders(api);

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
  }, [api]);

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
      order.status === "delivering",
  );
}, [activeTab, orders]);

  return (
    <main className="flex min-h-screen justify-center font-sofia">
      <section className="w-full max-w-[430px] min-h-screen px-13 pt-16 pb-[220px]">
         <header className="flex items-center justify-between mb-10 mt-1.5">
          <img src={LogoConsumer} alt="PickU" className="w-[72px] " />
        </header>

        <h1 className="mb-[20px] !font-sofia text-[24px] font-semibold leading-[1.1] text-black">
          Your orders
        </h1>

      {/*delivered or ongoing*/}

        <div className="mb-8 flex gap-3 overflow-x-auto">
          <button
            className={`rounded-full px-4 py-2 text-[15px] ${
              activeTab === "ongoing"
                ? "bg-orange/11 font-medium text-orange"
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
                ? "bg-orange/11 font-medium text-orange"
                : "bg-[#f6ede7] text-[rgba(27,27,27,0.38)]"
            }`}
            type="button"
            onClick={() => setActiveTab("delivered")}
          >
            Delivered
          </button>

          <button
          className={`rounded-full px-4 py-2 text-[15px] ${
            activeTab === "declined"
              ? "bg-orange/11 font-medium text-orange"
              : "bg-[#f6ede7] text-[rgba(27,27,27,0.38)]"
          }`}
          type="button"
          onClick={() => setActiveTab("declined")}
        >
          Cancelled
        </button>
        
        </div>


        {!feedbackMessage && filteredOrders.length === 0 ? (
        <div className="mt-65 flex flex-col items-center justify-center text-center">
          <p className="text-[18px] font-medium text-black">
            No orders here yet
          </p>

          <p className="mt-2 max-w-[260px] text-[15px] font-light leading-[1.4] text-[#7A716D]">
            Your orders will appear here.
          </p>
        </div>
      ) : null}

        <div className="flex flex-col gap-5">
          {filteredOrders.map((order) => {
            const item = order.items[0];

            {/*order card*/}

            return (
              <article
                key={order.id}
                className="grid cursor-pointer grid-cols-[102px_1fr] gap-3 rounded-2xl border border-[#DCD6D3] p-3"
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
                <img
                  className="h-[94px] w-[102px] rounded-[14px] bg-[#f2e7de] object-cover"
                  src={getOrderImage(order)}
                  alt={getOrderTitle(order)}
                />

                <div className="flex min-w-0 flex-col">
                  <div className="flex items-start justify-between gap-[10px]">
                    <div>
                      <h2 className="text-[16px] font-medium">{getOrderTitle(order)}</h2>
                      <p className="mt-1 text-[13px] text-black font-light">
                        {getOrderSubtitle(order)}
                      </p>
                    </div>

                    <span className="inline-flex h-7 min-w-[30px] items-center justify-center rounded-lg bg-orange px-1.5 text-[14px] text-white">
                      x{item?.quantity ?? 1}
                    </span>
                  </div>

                  <span className="inline-flex mb-2 items-center gap-1 text-[13px] font-light text-black">
                    <MapPinIcon className="h-[17px] w-[17px] shrink-0" />
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
      
      {/*navbar*/}
      
      <BottomNav variant="consumer" />
    </main>
  );
};

export default MyOrders;
