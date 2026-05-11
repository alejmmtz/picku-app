import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../../providers/AxiosProvider";
import { getOrders } from "../../../services/order.service";
import type { OrderResponse } from "../../../types/order.types";
import { getStoredAuth } from "../../../utils/storage";
import BottomNav from "../../../components/common/BottomNav";

type Entrepreneur = {
  id: string;
  name: string;
  is_active: boolean;
};

type DisplayOrder = {
  id: number;
  productName: string;
  customerName: string;
  distance: string;
  status: "Pending" | "Accepted" | "Delivered" | "Declined";
  quantity: number;
  price: number;
  img: string;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 0,
  }).format(value);

const mapStatus = (status: OrderResponse["status"]): DisplayOrder["status"] => {
  if (status === "accepted" || status === "delivering") return "Accepted";
  if (status === "delivered") return "Delivered";
  if (status === "declined") return "Declined";
  return "Pending";
};

const mapOrder = (order: OrderResponse): DisplayOrder => {
  const firstItem = order.items[0];

  return {
    id: order.id,
    productName: firstItem?.name ?? "Order",
    customerName: order.customer.name,
    distance: order.delivery_notes?.trim() ? "Pickup details added" : "Campus pickup",
    status: mapStatus(order.status),
    quantity: firstItem?.quantity ?? 1,
    price: order.total_price,
    img: firstItem?.img || "/resources/img-2-onboarding.svg",
  };
};

const statusClasses: Record<DisplayOrder["status"], string> = {
  Pending: "border-[#ffc64a] text-[#ffc64a]",
  Accepted: "border-[#7bad55] text-[#5c9c31]",
  Delivered: "border-[#7bad55] text-[#5c9c31]",
  Declined: "border-[#b64c4c] text-[#b64c4c]",
};

const EntrepreneurHome = () => {
  const api = useAxios();
  const navigate = useNavigate();
  const [entrepreneur, setEntrepreneur] = useState<Entrepreneur | null>(null);
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const auth = useMemo(() => getStoredAuth(), []);

  useEffect(() => {
    if (!auth) {
      navigate("/entrepreneur/login", { replace: true });
      return;
    }

    const loadHome = async () => {
      try {
        const [entrepreneurResponse, ordersResponse] = await Promise.all([
          api.get<Entrepreneur>("/picku/api/entrepreneurs/me"),
          getOrders(api),
        ]);

        setEntrepreneur(entrepreneurResponse.data);
        setOrders(ordersResponse.map(mapOrder));
      } catch (error) {
        setOrders([]);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          navigate("/entrepreneur/onboarding", { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadHome();
  }, [api, auth, navigate]);

  const deliveredCount = orders.filter((order) => order.status === "Delivered").length;
  const incomingCount = orders.filter((order) =>
    ["Pending", "Accepted"].includes(order.status)
  ).length;
  const businessName = entrepreneur?.name ?? "Your shop";
  const isOpen = entrepreneur?.is_active ?? true;

  const toggleShopStatus = async () => {
    if (!auth || !entrepreneur || isUpdatingStatus) return;

    const nextStatus = !entrepreneur.is_active;
    setIsUpdatingStatus(true);
    setEntrepreneur({ ...entrepreneur, is_active: nextStatus });

    try {
      const { data } = await api.patch<Entrepreneur>(
        "/picku/api/entrepreneurs/me/status",
        { is_active: nextStatus },
      );
      setEntrepreneur(data);
    } catch {
      setEntrepreneur(entrepreneur);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <main className="flex min-h-screen justify-center bg-background font-sofia text-black">
      <section className="min-h-screen w-full max-w-[430px] px-[30px] pt-[72px] pb-[144px]">
        <header className="flex items-center justify-between">
          <img className="w-[72px]" src="/logos/picku-logo.svg" alt="PickU" />
          <button
            className={`flex min-h-[45px] min-w-[110px] items-center justify-center rounded-[8px] px-[22px] text-[24px] font-semibold text-white transition-opacity disabled:opacity-70 ${
              isOpen ? "bg-[#48aa00]" : "bg-[#9d9d9d]"
            }`}
            type="button"
            disabled={!entrepreneur || isUpdatingStatus}
            onClick={toggleShopStatus}
          >
            {isOpen ? "Open" : "Closed"}
          </button>
        </header>

        <p className="mt-[40px] text-[24px] leading-[1.1]">
          Welcome back, {isLoading ? "..." : businessName}!
        </p>
        <h1 className="mt-[28px] max-w-[350px] !font-sofia text-[34px] font-bold leading-[1.05]">
          Let&#39;s see how your business is doing
        </h1>

        <section className="mt-[64px]">
          <h2 className="m-0 flex items-center gap-[12px] !font-sofia text-[26px] font-bold text-maroon">
            {businessName}
            <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#a9ed9d]">
              <img className="h-[17px] w-[17px]" src="/icons/check.svg" alt="" />
            </span>
          </h2>

          <div className="mt-[22px] grid grid-cols-2 gap-[8px]">
            <article className="min-h-[92px] rounded-[8px] border border-maroon px-[14px] py-[16px]">
              <div className="flex items-start justify-between gap-3">
                <p className="m-0 text-[16px] font-semibold leading-[1.1]">Orders Fulfilled</p>
                <img className="h-[30px] w-[30px] shrink-0 opacity-35" src="/icons/check-circle.svg" alt="" />
              </div>
              <strong className="mt-[14px] block text-[24px] leading-none">{deliveredCount}</strong>
            </article>

            <article className="min-h-[92px] rounded-[8px] border border-maroon px-[14px] py-[16px]">
              <div className="flex items-start justify-between gap-3">
                <p className="m-0 text-[16px] font-semibold leading-[1.1]">Incoming orders</p>
                <img className="h-[30px] w-[30px] shrink-0 opacity-35" src="/icons/clipboard.svg" alt="" />
              </div>
              <strong className="mt-[14px] block text-[24px] leading-none">{incomingCount}</strong>
            </article>
          </div>
        </section>

        <section className="mt-[48px]">
          <h2 className="m-0 !font-sofia text-[32px] font-medium leading-[1.1]">
            Recent Orders
          </h2>

          <div className="mt-[34px] flex flex-col gap-[26px]">
            {orders.length === 0 && !isLoading ? (
              <div className="rounded-[18px] border border-[#ded8d4] px-[18px] py-[22px] text-[15px] text-[#8d8a87]">
                You do not have recent orders yet.
              </div>
            ) : null}

            {orders.map((order) => (
              <article
                key={order.id}
                className="grid min-h-[134px] cursor-pointer grid-cols-[112px_minmax(0,1fr)] gap-[14px] rounded-[18px] border border-[#ded8d4] px-[14px] py-[14px]"
                onClick={() => navigate(`/entrepreneur/order?orderId=${order.id}`)}
              >
                <img
                  className="h-[106px] w-[112px] rounded-[10px] object-cover"
                  src={order.img}
                  alt=""
                  onError={(event) => {
                    event.currentTarget.src = "/resources/img-2-onboarding.svg";
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="m-0 min-w-0 flex-1 truncate !font-sofia text-[23px] font-bold leading-[1.05]">
                      {order.productName}
                    </h3>
                    <span className="shrink-0 rounded-[8px] bg-[#99041d] px-[12px] py-[7px] text-[17px] font-bold leading-none text-white">
                      x{order.quantity}
                    </span>
                  </div>
                  <p className="mt-[11px] truncate text-[15px] leading-none">{order.customerName}</p>
                  <p className="mt-[11px] flex items-center gap-[6px] truncate text-[15px] font-semibold leading-none">
                    <img className="h-[17px] w-[17px] shrink-0" src="/icons/map-pin.svg" alt="" />
                    {order.distance}
                  </p>
                  <div className="mt-[18px] flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full border px-[13px] py-[3px] text-[15px] font-medium ${statusClasses[order.status]}`}
                    >
                      {order.status}
                    </span>
                    <strong className="shrink-0 text-[23px] leading-none">
                      ${formatCurrency(order.price)}
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <BottomNav variant="entrepreneur" />
    </main>
  );
};

export default EntrepreneurHome;
