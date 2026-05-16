import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReceiptCard from "./components/ReceiptCard";
import { useAxios } from "../../../providers/AxiosProvider";
import { getOrderById } from "../../../services/order.service";
import type { OrderResponse } from "../../../types/order.types";

export default function OrderReceipt() {
  const api = useAxios();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const orderIdParam = searchParams.get("orderId");
  const orderId = orderIdParam ? Number(orderIdParam) : null;

  useEffect(() => {
    let isMounted = true;

    const loadOrder = async () => {
      if (orderId === null || !Number.isFinite(orderId)) {
        setFeedbackMessage("This receipt is not available.");
        return;
      }

      try {
        const data = await getOrderById(api, orderId);

        if (!isMounted) return;

        setOrder(data);
      } catch (error) {
        if (!isMounted) return;

        setFeedbackMessage(
          error instanceof Error ? error.message : "We could not load this receipt.",
        );
      }
    };

    void loadOrder();

    return () => {
      isMounted = false;
    };
  }, [api, orderId]);

  if (!order) {
    return (
      <main className="min-h-screen bg-background px-13 text-black sm:py-6">
        <section className="relative flex h-dvh w-full flex-col items-center justify-center bg-background text-center">
          <p className="text-sm text-black/60">
            {feedbackMessage || "Loading receipt..."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/entrepreneur/home")}
            className="mt-6 rounded-xl bg-maroon px-6 py-4 text-[15px]  text-white transition-transform active:scale-[0.99]"
          >
            Go back to orders
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-13 py-13 text-black sm:py-6">
      <section className="relative h-dvh w-full bg-background">
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex flex-1 flex-col">
            <div className="flex justify-center p-12 ">
              <img
                src="/resources/receipt-guy-entrepreneur.png"
                alt="PickU"
                className="h-auto w-72"
              />
            </div>

            <ReceiptCard order={order} />

            <button
              type="button"
              onClick={() => navigate("/entrepreneur/home")}
              className="mt-12 mb-12 rounded-xl bg-maroon px-6 py-4 text-[15px]  text-white transition-transform active:scale-[0.99]"
            >
              Go back to orders
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
