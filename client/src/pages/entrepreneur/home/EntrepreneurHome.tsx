import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../../providers/AxiosProvider";
import { getOrders } from "../../../services/order.service";
import type { OrderResponse } from "../../../types/order.types";
import { getStoredAuth } from "../../../utils/storage";
import BottomNav from "../../../components/common/BottomNav";

import LogoEntrepreneur from "../../../assets/logo entrepeneur color.svg";
import CheckIcon from "../../../assets/check icon.svg?react";
import CheckCircleIcon from "../../../assets/check_circle.svg?react";
import ClipboardIcon from "../../../assets/clipboard.svg?react";
import MapPinIcon from "../../../assets/map-pin.svg?react";
import Loader from "../../../components/common/LoaderEntrepreneur";

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
  Pending: "border-[#ffc64a] bg-[#FFC64A]/8 text-[#ffc64a]",
  Accepted: "border-[#5ba7ff] bg-[#edf5ff] text-[#3478c9]",
  Delivered: "border-[#7bad55] bg-[#93E47A]/10 text-[#5c9c31]",
  Declined: "border-[#b64c4c] bg-[#86081F]/8 text-[#b64c4c]",
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
      <section className="w-full max-w-[430px] min-h-screen px-13 pt-16 pb-[140px]">
        <header className="flex items-center justify-between mb-7">
            <img src={LogoEntrepreneur} alt="PickU" className="w-[72px] " />
          <button
            className={`flex min-h-[40px] min-w-[64px] items-center justify-center rounded-[8px]  px-[22px] text-[15px] font-medium text-white transition-opacity disabled:opacity-70 ${
              isOpen ? "bg-[#48aa00]" : "bg-[#9d9d9d]"
            }`}
            type="button"
            disabled={!entrepreneur || isUpdatingStatus}
            onClick={toggleShopStatus}
          >
            {isOpen ? "Open" : "Closed"}
          </button>
        </header>
      
      {/*entrepreneur info*/}
      
        <p className="mt-[35px] text-[17px] font-light leading-[1.1]">
          Welcome back, {isLoading ? "..." : businessName}!
        </p>
        <h1 className="mt-[15px] max-w-[350px] !font-sofia text-[30px] font-semibold leading-[1.05]">
          Let's see how your business is doing
        </h1>
      
      {/*orders info*/}

        <section className="mt-[30px]">
          <h2 className="m-0 flex items-center gap-[12px] !font-sofia text-[17px] font-medium text-maroon">
            {businessName}
            <span className="flex items-center justify-center">
              <CheckIcon className="h-[25px] w-[30px]" />
            </span>
          </h2>

          <div className="mt-[12px] grid grid-cols-2 gap-[8px]">
  <article className="h-[82px] rounded-[14px] border-[1.5px] border-maroon px-[14px] py-[10px]">
    <div className="flex items-start justify-between">
      <p className="text-[14px] font-light leading-[1.1] text-black">
        Orders Fulfilled
      </p>

      <CheckCircleIcon className="h-[30px] w-[30px] mt-6 shrink-0 text-maroon" />
    </div>

    <strong className="mt-[-30px] block text-[30px] font-medium leading-none text-black">
      {deliveredCount}
    </strong>
  </article>

  <article className="h-[82px] rounded-[14px] border-[1.5px] border-maroon px-[14px] py-[10px]">
    <div className="flex items-start justify-between">
      <p className="text-[13px] font-light leading-[1.1] text-black">
        Incoming orders
      </p>

      <ClipboardIcon className="h-[30px] w-[30px] mt-6 shrink-0 text-maroon" />
    </div>

    <strong className="mt-[-30px] block text-[30px] font-medium leading-none text-black">
      {incomingCount}
    </strong>
  </article>
</div>
        </section>
        
        {/*recent orders*/}

        <section className="mt-[45px]">
          <h2 className="m-0 !font-sofia text-[18px] font-regular leading-[1.1]">
            Recent Orders
          </h2>

          <div className="mt-[25px] flex flex-col gap-[26px]">

            {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader message="Loading recent orders..." />
            </div>
          ) : null}

            {orders.length === 0 && !isLoading ? (
              <div className="py-[22px] text-[15px] text-[#8d8a87]">
                You do not have recent orders yet.
              </div>
            ) : null}

            {!isLoading &&
            orders.map((order) => (
              <article
                key={order.id}
                className="grid min-h-[134px] cursor-pointer grid-cols-[112px_minmax(0,1fr)] gap-[3px] rounded-[18px] border border-[#DCD6D3] px-[14px] py-[14px]"
                onClick={() => navigate(`/entrepreneur/order?orderId=${order.id}`)}
              >
                <img
                  className="h-[94px] w-[102px] rounded-[14px] object-cover"
                  src={order.img}
                  alt=""
                  onError={(event) => {
                    event.currentTarget.src = "/resources/img-2-onboarding.svg";
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="m-0 min-w-0 flex-1 truncate !font-sofia text-[16px] font-medium leading-[1.05]">
                      {order.productName}
                    </h3>
                    <span className="inline-flex h-7 min-w-[30px] items-center font-medium justify-center rounded-lg bg-maroon px-1.5 text-[14px] text-white">
                      x{order.quantity}
                    </span>
                  </div>

                  <p className="truncate text-[13px] mt-[-2px] text-black font-light leading-none mb-1">{order.customerName}</p>
                  <p className="inline-flex mb-1 items-center gap-1 text-[13px] text-black">
                    <MapPinIcon className="h-[17px] w-[17px] shrink-0" />
                    {order.distance}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full border mt-1 px-[13px] py-[2px] text-[15px] font-regular ${statusClasses[order.status]}`}
                    >
                      {order.status}
                    </span>
                    <strong className="text-[18px] font-semibold text-black">
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
