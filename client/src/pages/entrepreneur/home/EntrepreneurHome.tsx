import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../../providers/AxiosProvider";
import { getOrders } from "../../../services/order.service";
import type { OrderResponse } from "../../../types/order.types";
import { getStoredAuth } from "../../../utils/storage";
import BottomNav from "../../../components/common/BottomNav";
import { useEntrepreneurOrdersRealtime } from "../../../providers/OrdersRealtimeProvider";
// Importamos el Loader común para consistencia
import Loader from "../../../components/common/Loader";

import LogoEntrepreneur from "../../../assets/logo entrepeneur color.svg";
import CheckIcon from "../../../assets/check icon.svg?react";
import CheckCircleIcon from "../../../assets/check_circle.svg?react";
import ClipboardIcon from "../../../assets/clipboard.svg?react";

type Entrepreneur = {
  id: string;
  name: string;
  is_active: boolean;
  img: string;
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

const mapStatus = (status: OrderResponse["status"]): DisplayOrder["status"] => {
  if (
    status === "accepted" ||
    status === "preparing" ||
    status === "delivering"
  )
    return "Accepted";
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
    distance: order.delivery_notes?.trim()
      ? "Pickup details added"
      : "Campus pickup",
    status: mapStatus(order.status),
    quantity: firstItem?.quantity ?? 1,
    price: order.total_price,
    img: firstItem?.img,
  };
};

const statusClasses: Record<DisplayOrder["status"], string> = {
  Pending: "border-yellow-500 bg-yellow-50 text-yellow-700",
  Accepted: "border-blue-500 bg-blue-50 text-blue-700",
  Delivered: "border-green-600 bg-green-50 text-green-700",
  Declined: "border-red-600 bg-red-50 text-red-700",
};

const EntrepreneurHome = () => {
  const api = useAxios();
  const navigate = useNavigate();
  const [entrepreneur, setEntrepreneur] = useState<Entrepreneur | null>(null);
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const auth = useMemo(() => getStoredAuth(), []);
  const userName = auth?.user.user_metadata?.name ?? "there";

  const loadHome = useCallback(
    async (isMounted: () => boolean = () => true) => {
      try {
        const [entrepreneurResponse, ordersResponse] = await Promise.all([
          api.get<Entrepreneur>("/picku/api/entrepreneurs/me"),
          getOrders(api),
        ]);

        if (!isMounted()) return;

        setEntrepreneur(entrepreneurResponse.data);
        setOrders(ordersResponse.map(mapOrder));
      } catch (error) {
        if (!isMounted()) return;
        setOrders([]);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          navigate("/entrepreneur/onboarding", { replace: true });
        }
      } finally {
        if (isMounted()) setIsLoading(false);
      }
    },
    [api, navigate],
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(value);

  useEffect(() => {
    if (!auth) {
      navigate("/entrepreneur/login", { replace: true });
      return;
    }
    let isMounted = true;
    void Promise.resolve().then(() => loadHome(() => isMounted));
    return () => {
      isMounted = false;
    };
  }, [auth, loadHome, navigate]);

  useEntrepreneurOrdersRealtime(entrepreneur?.id ?? null, () => {
    void loadHome();
  });

  const deliveredCount = orders.filter(
    (order) => order.status === "Delivered",
  ).length;
  const incomingCount = orders.filter((order) =>
    ["Pending", "Accepted"].includes(order.status),
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
    <main className="app-shell">
      <section className="app-screen mb-16 transition-all">
        <header className="flex items-start justify-between mb-4 transition-all">
          <img src={LogoEntrepreneur} alt="PickU" className="w-16" />
          <button
            type="button"
            disabled={!entrepreneur || isUpdatingStatus}
            onClick={toggleShopStatus}
            className={`px-6 py-2 rounded-full text-sm font-medium text-white transition-all ${
              isOpen ? "bg-maroon " : "bg-maroon/25"
            }`}
          >
            {isOpen ? "Open" : "Closed"}
          </button>
        </header>

        <section className="mb-6">
          <p className="text-lg font-light">
            Welcome back, {isLoading ? "Owner" : userName}!
          </p>
          <h2 className="app-title text-2xl">
            Let's see how's your business doing...
          </h2>
        </section>

        {entrepreneur?.img ? (
          <div className="p-4 bg-maroon rotate-1 rounded-2xl scale-103 shadow-xl">
            <img
              src={entrepreneur.img}
              alt={businessName}
              className="w-full h-60 object-cover rounded-lg shadow-sm mb-2"
            />
            <h2 className="flex items-center text-white gap-2 text-xl font-semibold ">
              {businessName}
              <CheckIcon className="w-6 h-6" />
            </h2>
          </div>
        ) : null}

        <section className="mt-6 mb-4">
          <div className="flex gap-2">
            <article className="flex-1 rounded-xl border border-black/10 p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start ">
                <p className="text-sm font-light text-black">
                  Orders Fulfilled
                </p>
                <CheckCircleIcon className="w-6 h-6 text-black/40" />
              </div>
              <h2 className="text-3xl font-semibold">{deliveredCount}</h2>
            </article>

            <article className="flex-1 rounded-xl border border-black/10 p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start ">
                <p className="text-sm font-light text-black">Incoming orders</p>
                <ClipboardIcon className="w-6 h-6 text-black/40" />
              </div>
              <h2 className="text-3xl font-semibold">{incomingCount}</h2>
            </article>
          </div>
        </section>
        <img
          src="/resources/banner.svg"
          className="w-full object-cover rounded-lg shadow-sm mb-6 "
        />
        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

          {isLoading && <Loader message="Loading recent orders..." />}

          {!isLoading && orders.length === 0 && (
            <div className="text-center py-12 text-black/50 font-light">
              You do not have recent orders yet.
            </div>
          )}

          <div className="flex flex-col gap-4 ">
            {!isLoading &&
              orders.map((order) => (
                <article
                  key={order.id}
                  onClick={() =>
                    navigate(`/entrepreneur/order?orderId=${order.id}`)
                  }
                  className="app-card bg-white p-4 cursor-pointer transition-all duration-300 active:scale-[0.99]"
                >
                  <div className="flex gap-4 ">
                    <img
                      className="h-24 w-24 rounded-xl object-cover shrink-0 bg-gray-100"
                      src={order.img || entrepreneur?.img}
                      alt={order.productName}
                      onError={(e) => {
                        e.currentTarget.src = "/resources/img-2-onboarding.svg";
                      }}
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-end justify-between gap-2">
                          <h3 className="text-lg font-medium text-black line-clamp-1">
                            {order.productName}
                          </h3>
                          <span className="rounded-md border text-sm px-2 py-1 font-light bg-maroon text-white whitespace-nowrap shrink-0">
                            x{order.quantity}
                          </span>
                        </div>
                        <p className="text-sm font-light text-black/60 line-clamp-1">
                          asked by {order.customerName}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs border ${statusClasses[order.status]}`}
                        >
                          {order.status}
                        </span>
                        <strong className="text-lg font-semibold text-black">
                          ${formatCurrency(order.price)}
                        </strong>
                      </div>
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
