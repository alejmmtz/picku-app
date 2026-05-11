import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAxios } from "../../../providers/AxiosProvider";
import { useCart } from "../../../providers/CartProvider";
import { createOrder } from "../../../services/order.service";
import type { UserPosition } from "../../../types/order.types";

import LogoConsumer from "../../../assets/logo consumer.png";
import ArrowIcon from "../../../assets/arrow.svg?react";
import LocationMap from "../../../components/common/LocationMap";

const Checkout = () => {
  const api = useAxios();
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();

  const [pickupDetails, setPickupDetails] = useState("");
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "success" | "denied" | "error"
  >("loading");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

useEffect(() => {
  if (!navigator.geolocation) {
    queueMicrotask(() => {
      setLocationStatus("error");
    });

    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setUserPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      setLocationStatus("success");
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        setLocationStatus("denied");
      } else {
        setLocationStatus("error");
      }
    }
  );
}, []);


  const handlePlaceOrder = () => {
    if (cartItems.length === 0 || isSubmitting) {
      return;
    }

    const orderPayload = {
      items: cartItems,
      delivery_notes: pickupDetails,
      user_position: userPosition ?? undefined,
      total_price: subtotal,
    };

    const submitOrder = async () => {
      try {
        setIsSubmitting(true);
        setErrorMessage("");
        await createOrder(api, orderPayload);
        clearCart();
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

        {userPosition ? (
        <LocationMap
          latitude={userPosition.latitude}
          longitude={userPosition.longitude}
        />
        ) : (
          <div className="mb-6 flex h-[128px] w-full items-center justify-center font-light rounded-[12px] border border-[#DCD6D3] text-[13px] text-[#85827F]">
            Waiting for location...
          </div>
        )}

        <div className="mb-6">
          {locationStatus === "success" && (
            <p className="text-[14px] font-light text-[#4FA83D]">
              Current location enabled.
            </p>
          )}

          {locationStatus === "denied" && (
            <p className="text-[13px] text-orange">
              Location access denied. Add pickup details manually.
            </p>
          )}

          {locationStatus === "error" && (
            <p className="text-[13px] text-orange">
              Location unavailable. Add pickup details manually.
            </p>
          )}

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
