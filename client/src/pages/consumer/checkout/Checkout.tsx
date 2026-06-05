import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ArrowIcon from "../../../assets/arrow.svg?react";
import ClockIcon from "../../../assets/clock.svg?react";
import MapPinIcon from "../../../assets/map-pin.svg?react";
import LocationMap from "../../../components/common/LocationMap";
import {
  DEFAULT_MAP_CENTER,
  type MapCenter,
} from "../../../providers/MapsProvider";
import { useAxios } from "../../../providers/AxiosProvider";
import { useCart } from "../../../providers/CartProvider";
import { reverseGeocode } from "../../../services/geocoding.service";
import { createOrder } from "../../../services/order.service";
import type { CreateOrderDTO } from "../../../types/order.types";

const Checkout = () => {
  const api = useAxios();
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();
  const [pickupDetails, setPickupDetails] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState<MapCenter | null>(
    null,
  );
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const geocodingRequestRef = useRef(0);
  const addressFieldValue = isResolvingAddress
    ? "Finding address..."
    : deliveryAddress || "";
  const deliveryMarkers = useMemo(
    () =>
      deliveryLocation
        ? [
            {
              id: "delivery",
              center: deliveryLocation,
              draggable: true,
              pinClassName: "bg-orange",
            },
          ]
        : [],
    [deliveryLocation],
  );
  const onMarkerDrop = useCallback(async (location: MapCenter) => {
    const requestId = geocodingRequestRef.current + 1;
    geocodingRequestRef.current = requestId;
    setDeliveryLocation(location);
    setDeliveryAddress("");
    setIsResolvingAddress(true);
    setErrorMessage("");

    const nextAddress = await reverseGeocode(location);

    if (geocodingRequestRef.current === requestId) {
      setDeliveryAddress(nextAddress);
      setIsResolvingAddress(false);
    }
  }, []);

  const handlePlaceOrder = () => {
    if (cartItems.length === 0 || isSubmitting) return;

    if (!deliveryLocation) {
      setErrorMessage("Select your exact delivery point on the map.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    void processOrder(deliveryLocation);
  };

  const processOrder = async (coords: MapCenter) => {
    const orderGroups = new Map<string, CreateOrderDTO>();

    for (const item of cartItems) {
      const entrepreneurId = item.product.entrepreneur_id;
      const productId = Number(item.product.id);
      const quantity = Number(item.quantity);

      const currentGroup = orderGroups.get(entrepreneurId);
      if (currentGroup) {
        currentGroup.products.push({ product_id: productId, quantity });
      } else {
        orderGroups.set(entrepreneurId, {
          entrepreneur_id: entrepreneurId,
          delivery_notes: pickupDetails.trim() || null,
          location: coords,
          products: [{ product_id: productId, quantity }],
        });
      }
    }

    try {
      const createdOrders = [];
      for (const orderPayload of orderGroups.values()) {
        const order = await createOrder(api, orderPayload);
        createdOrders.push(order);
      }
      clearCart();
      navigate(
        createdOrders.length === 1
          ? `/consumer/order?orderId=${createdOrders[0].id}`
          : "/consumer/orders",
        { replace: true },
      );
    } catch {
      setErrorMessage("We could not create your order. Try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          <h2 className="mb-2 text-2xl font-semibold leading-tight">
            Checkout
          </h2>
          <p className="font-light text-black/70">
            Place the pin exactly where you want to receive your order.
          </p>
        </header>

        <div className="mt-8">
          <LocationMap
            center={deliveryLocation ?? DEFAULT_MAP_CENTER}
            zoom={17}
            markerMode="leaflet"
            markers={deliveryMarkers}
            onMapClick={onMarkerDrop}
            onMarkerDragEnd={(_, location) => {
              void onMarkerDrop(location);
            }}
            className="relative h-56 w-full overflow-hidden rounded-xl border border-orange/20 bg-[#f4ebe3] shadow-[0_8px_22px_rgba(80,3,17,0.06)]"
          />

          <label className="mt-3 flex flex-col gap-2">
            <span className="text-sm font-light text-black/65">
              Delivery address
            </span>
            <input
              readOnly
              value={addressFieldValue}
              placeholder="Tap the map or drag the pin"
              className="app-field w-full rounded-xl border-black/15 bg-transparent px-4 py-3 text-[14px] font-light outline-none placeholder:text-black/45"
            />
          </label>

          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-black/15 px-4 py-3 text-[14px] font-light text-black/75">
            <span className="inline-flex min-w-0 items-center gap-2">
              <MapPinIcon className="h-4 w-4 shrink-0 text-orange" />
              <span className="truncate">
                {deliveryLocation
                  ? `${deliveryLocation.lat.toFixed(6)}, ${deliveryLocation.lng.toFixed(6)}`
                  : "No point selected"}
              </span>
            </span>

            <span className="inline-flex shrink-0 items-center gap-2">
              <ClockIcon className="h-4 w-4 shrink-0 text-orange" />
              Manual
            </span>
          </div>
        </div>

        {errorMessage ? (
          <p className="mt-4 text-[13px] text-[#b4202f]">{errorMessage}</p>
        ) : null}

        <div className="mt-8">
          <label className="flex flex-col gap-3">
            <span className="text-lg">Delivery Details</span>

            <textarea
              value={pickupDetails}
              onChange={(event) => setPickupDetails(event.target.value)}
              placeholder="e.g. I'm in the cafeteria, I have a blue shirt."
              className="app-field min-h-36 w-full resize-none rounded-xl border-black/15 bg-transparent px-5 py-4 text-[14px] font-light outline-none transition-all duration-500 placeholder:text-black/50 focus:shadow-[0_0_0_3px_rgba(255,112,45,0.12)]"
            />
          </label>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          {cartItems.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center justify-between rounded-xl font-light"
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
              <p className="text-lg">Subtotal</p>
              <p className="text-2xl leading-none text-orange">
                ${subtotal.toLocaleString("es-CO")}
              </p>
            </div>

            <button
              type="button"
              disabled={
                cartItems.length === 0 || isSubmitting || !deliveryLocation
              }
              onClick={handlePlaceOrder}
              className={`app-action px-9 text-[16px] ${
                cartItems.length === 0 || isSubmitting || !deliveryLocation
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
