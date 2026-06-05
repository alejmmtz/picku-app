import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAxios } from "../../../providers/AxiosProvider";
import { useCart } from "../../../providers/CartProvider";
import { createOrder } from "../../../services/order.service";
import type { CreateOrderDTO } from "../../../types/order.types";

import ArrowIcon from "../../../assets/arrow.svg?react";
import MapPinIcon from "../../../assets/map-pin.svg?react";
import ClockIcon from "../../../assets/clock.svg?react";
import LocationMap from "../../../components/common/LocationMap";

const Checkout = () => {
  const api = useAxios();
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();

  const [pickupDetails, setPickupDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePlaceOrder = () => {
    if (cartItems.length === 0 || isSubmitting) {
      return;
    }

    const orderGroups = new Map<string, CreateOrderDTO>();

    for (const item of cartItems) {
      const entrepreneurId = item.product.entrepreneur_id;
      const productId = Number(item.product.id);
      const quantity = Number(item.quantity);

      if (!Number.isFinite(productId) || !Number.isFinite(quantity)) {
        setErrorMessage(
          "There is an invalid product in your cart. Please update your cart and try again.",
        );
        return;
      }

      const currentGroup = orderGroups.get(entrepreneurId);

      if (currentGroup) {
        currentGroup.products.push({
          product_id: productId,
          quantity,
        });
        continue;
      }

      orderGroups.set(entrepreneurId, {
        entrepreneur_id: entrepreneurId,
        delivery_notes: pickupDetails.trim() ? pickupDetails.trim() : null,
        products: [
          {
            product_id: productId,
            quantity,
          },
        ],
      });
    }

    const submitOrder = async () => {
      try {
        setIsSubmitting(true);
        setErrorMessage("");
        const createdOrders = [];

        for (const orderPayload of orderGroups.values()) {
          const order = await createOrder(api, orderPayload);
          createdOrders.push(order);
        }

        clearCart();

        if (createdOrders.length === 1) {
          navigate(`/consumer/order?orderId=${createdOrders[0].id}`, {
            replace: true,
          });
          return;
        }

        navigate("/consumer/orders", { replace: true });
      } catch (error) {
        console.error("Error creating order:", error);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Could not create your order. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    void submitOrder();
  };

  return (
    <main className="app-shell">
      <section className="app-screen pb-36">
        <button
          type="button"
          onClick={() => navigate("/consumer/cart")}
          className="mb-4 flex items-center gap-2 bg-transparent p-0 text-[17px] font-light transition-all duration-500 active:scale-95"
        >
          <ArrowIcon className="h-4 w-4" />
          <span>Cart</span>
        </button>

        <header>
          <h2 className="mb-2 text-2xl  font-semibold leading-tight">
            Checkout
          </h2>
          <p className="font-light text-black/70">
            Confirm your pickup spot before placing the order.
          </p>
        </header>

        <div className="mt-8">
          <LocationMap className="relative h-48 w-full overflow-hidden rounded-xl border border-orange/20 bg-[#f4ebe3] shadow-[0_8px_22px_rgba(80,3,17,0.06)]" />

          <div className="mt-3 flex items-center justify-between rounded-xl border border-black/15 px-4 py-3 text-[14px] font-light text-black/75">
            <span className="inline-flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 shrink-0 text-orange" />
              Campus pickup
            </span>

            <span className="inline-flex items-center gap-2">
              <ClockIcon className="h-4 w-4 shrink-0 text-orange" />3 min
            </span>
          </div>
        </div>

        {errorMessage ? (
          <p className="mt-4 text-[13px] text-[#b4202f]">{errorMessage}</p>
        ) : null}

        <div className="mt-8">
          <label className="flex flex-col gap-3">
            <span className="text-lg ">Pickup Details</span>

            <textarea
              value={pickupDetails}
              onChange={(event) => setPickupDetails(event.target.value)}
              placeholder="e.g. I'm in the cafeteria, I have a blue shirt."
              className="app-field min-h-36 w-full resize-none border-black/15 rounded-xl  bg-transparent px-5 py-4 text-[14px] font-light outline-none transition-all duration-500 placeholder:text-black/50 focus:shadow-[0_0_0_3px_rgba(255,112,45,0.12)]"
            />
          </label>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          {cartItems.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center justify-between rounded-xl   font-light"
            >
              <p className="min-w-0 pr-3">
                <span className="font-semibold">x{item.quantity}</span>{" "}
                {item.product.name}
              </p>

              <p className="shrink-0 font-medium">
                ${(item.product.price * item.quantity).toLocaleString("es-CO")}
              </p>
            </div>
          ))}

          <div className="h-px bg-[#DCD6D3]" />

          <div className="flex items-center justify-between text-lg font-medium">
            <p>Subtotal</p>
            <p>${subtotal.toLocaleString("es-CO")}</p>
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 w-full -translate-x-1/2 rounded-t-2xl border-t border-black/10 bg-white px-12 py-7 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg ">Subtotal</p>
              <p className="text-2xl leading-none text-orange">
                ${subtotal.toLocaleString("es-CO")}
              </p>
            </div>

            <button
              type="button"
              disabled={cartItems.length === 0 || isSubmitting}
              onClick={handlePlaceOrder}
              className={`app-action px-9 text-[16px] ${
                cartItems.length === 0 || isSubmitting
                  ? "bg-orange/40"
                  : "bg-orange"
              }`}
            >
              {isSubmitting ? "Processing..." : "Checkout"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Checkout;
