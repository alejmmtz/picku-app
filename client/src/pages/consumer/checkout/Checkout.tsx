import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAxios } from "../../../providers/AxiosProvider";
import { useCart } from "../../../providers/CartProvider";
import { createOrder } from "../../../services/order.service";
import type { CreateOrderDTO } from "../../../types/order.types";

import LogoConsumer from "../../../assets/logo consumer.png";
import ArrowIcon from "../../../assets/arrow.svg?react";
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
    <main className="min-h-screen flex justify-center bg-background font-sofia text-black">
      <section className="relative w-full max-w-[430px] min-h-screen px-13 pt-16 ">
        <img src={LogoConsumer} alt="PickU" className="w-[72px] mt-1.5 mb-8" />

        <button
          type="button"
          onClick={() => navigate("/consumer/cart")}
          className="mb-4 flex items-center gap-2 font-regular text-[17px]"
        >
          <ArrowIcon className="w-4 h-4" />
          <span>Cart</span>
        </button>

        <h2 className="mb-6 text-[28px] font-bold">Checkout</h2>

        {/* map ui */}

        <LocationMap />

        <div className="mb-6">
          <p className="text-[13px] text-[#85827F]">
            Static campus map preview for this first delivery.
          </p>

          {errorMessage ? (
            <p className="mt-2 text-[13px] text-[#b4202f]">
              {errorMessage}
            </p>
          ) : null}
        </div>

        {/*pick up details*/}

        <div className="mb-24">
          <h2 className="mb-4 text-[20px] font-regular">Pickup Details</h2>

          <textarea
            value={pickupDetails}
            onChange={(event) => setPickupDetails(event.target.value)}
            placeholder="e.g, I’m in the cafeteria, I have blue shirt."
            className="h-[126px] w-full resize-none rounded-[10px] font-light border border-orange bg-transparent px-5 py-4 text-[14px] outline-none placeholder:text-[#7B7B7B] focus:border-orange"
          />
        </div>

        {/* items detail */}
        <div className="mb-8 flex flex-col gap-4">
          {cartItems.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center font-light justify-between text-[17px]"
            >
              <p>
                {item.product.name} x{item.quantity}
              </p>

              <p>
                ${(item.product.price * item.quantity).toLocaleString("es-CO")}
              </p>
            </div>
          ))}

          <div className="h-px bg-[#DCD6D3]" />

          <div className="flex items-center justify-between text-[17px] font-medium">
            <p>Subtotal</p>
            <p>${subtotal.toLocaleString("es-CO")}</p>
          </div>
        </div>

        {/* subtotal */}

        <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 rounded-t-[18px] bg-white px-13 py-7 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between gap-5">
            <div>
              <p className="text-[16px] font-light">Subtotal</p>
              <p className="text-[28px] leading-none text-orange">
                ${subtotal.toLocaleString("es-CO")}
              </p>
            </div>

            <button
              type="button"
              disabled={cartItems.length === 0 || isSubmitting}
              onClick={handlePlaceOrder}
              className={`h-[50px] rounded-[10px] px-9 text-[16px] font-light text-white ${
                cartItems.length === 0 || isSubmitting
                  ? "cursor-not-allowed bg-orange/40"
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
