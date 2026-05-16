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
    "inline-flex min-h-6 items-center justify-center rounded-full border border-[#ecb100] bg-[#fff8da] px-3  py-1  text-[14px] text-[#ecb100]",
  accepted:
    "inline-flex min-h-6 items-center justify-center rounded-full border border-orange bg-[#fff0e8] px-3  py-1  text-[14px] text-orange",
  declined:
    "inline-flex min-h-6 items-center justify-center rounded-full border border-[#b4202f] bg-[#fff3f3] px-3 py-1 text-[14px] text-[#b4202f]",
  delivering:
    "inline-flex min-h-6 items-center justify-center rounded-full border border-orange bg-[#fff0e8] px-3 py-1  text-[14px] text-orange",
  delivered:
    "inline-flex min-h-6 items-center justify-center rounded-full border border-[#78aa38] bg-[#eef8df] px-3  py-1  text-[14px] text-[#78aa38]",
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
        ? "Todavía no pudimos cargar este pedido. Cuando el backend lo envíe correctamente, se mostrará aquí."
        : "Este pedido no es válido o todavía no está disponible.",
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
          "Todavía no pudimos cargar este pedido. Cuando el backend lo envíe correctamente, se mostrará aquí.",
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
      <main className="flex min-h-screen justify-center bg-background font-sofia">
        <section className="min-h-screen w-full max-w-[430px] bg-background px-13 pt-7 pb-9 font-sofia">

          <button
            className="mt-0 inline-flex min-h-10 items-center gap-2 rounded-[14px] bg-[rgba(255,255,255,0.86)] px-4 !font-sofia text-[16px] font-medium"
            type="button"
            onClick={() => navigate("/consumer/orders")}
          >
            <img className="h-[18px] w-[18px]" src="/icons/arrow-left.svg" alt="" />
            <span>Orders</span>
          </button>

          <div className="mt-10 rounded-[24px] border border-[#ddd2ca] bg-[rgba(255,255,255,0.62)] p-6">
            <h1 className="!font-sofia text-[22px] font-semibold text-black">
              Order details
            </h1>
            <p className="mt-3 text-[15px] leading-[1.35] text-[rgba(27,27,27,0.68)]">
              {feedbackMessage}
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen justify-center bg-background font-sofia">
      <section className="min-h-screen w-full max-w-[430px] bg-background font-sofia">
        <div className="relative h-[324px] overflow-hidden px-13 pt-7">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={primaryItem.img || order.entrepreneur.img}
            alt={primaryItem.name}
          />

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,244,0.04),rgba(255,250,244,0.34))]" />

          <div className="absolute left-8 top-14">

          <button
            type="button"
            onClick={() => navigate("/consumer/orders")}
            className="flex items-center gap-1 rounded-full font-regular bg-white/80 px-3 ml-4 py-1 text-[13px] shadow-sm"
          >
            <ArrowIcon className="w-3 h-3" />
            <span>Orders</span>
          </button>
          </div>
        </div>

        <div className="relative z-20 -mt-5 rounded-t-[28px] bg-background px-13 pt-7 pb-9">
          <span className="absolute top-[-22px] right-[50px] inline-flex h-11 min-w-[54px] items-center justify-center rounded-[10px] bg-orange px-[10px] font-medium text-[22px] font-sofia text-white">
            x{primaryItem.quantity}
          </span>

          <div className="flex items-start justify-between gap-[14px] mt-5">
            <div>
              <h1 className="!font-sofia text-[22px] font-medium text-black">
                {primaryItem.name}
              </h1>
              <p className=" font-sofia text-[32px] font-medium text-orange">
                {formatPrice(order.total_price)}
              </p>
            </div>

            <span className={statusClassMap[order.status]}>
              {statusLabelMap[order.status]}
            </span>
          </div>

          <h2 className="mt-[35px] mb-3 font-sofia text-[18px] font-regular text-black">
            Delivery notes
          </h2>
          <p className="m-0 font-sofia font-light text-[16px] leading-[1.15] text-[#707070]">
            {getOrderDescription(order)}
          </p>

          {order.cancel_reason ? (
            <section className="mt-[30px] rounded-[14px] border-[1.5px] border-[#b4202f] p-[20px]">
              <h3 className="mb-2 font-sofia text-[16px] font-medium text-[#b4202f]">
                Reason for order decline
              </h3>
              <p className="m-0 font-sofia text-[15px] font-light leading-[1.1] text-[rgba(27,27,27,0.7)]">
                {order.cancel_reason}
              </p>
            </section>
          ) : null}

          {feedbackMessage ? (
            <p className="mt-[18px] font-sofia text-[13px] text-[rgba(27,27,27,0.58)]">
              {feedbackMessage}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
};

export default OrderDetails;
