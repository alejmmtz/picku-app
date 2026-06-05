import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import LocationMap from "../../../../components/common/LocationMap";
import { useOrderTracking } from "../../../../hooks/useOrderTracking";
import { DEFAULT_MAP_CENTER } from "../../../../providers/MapsProvider";
import { ACTIVE_MAP_STYLE } from "../orderFlow.constants";

type OrderMapProps = {
  orderId?: number | null;
  orderStatus?: string | null;
};

function OrderMap({ orderId: orderIdProp, orderStatus }: OrderMapProps) {
  const [searchParams] = useSearchParams();
  const orderIdFromQuery = Number(searchParams.get("orderId"));
  const resolvedOrderId =
    orderIdProp ??
    (Number.isFinite(orderIdFromQuery) ? orderIdFromQuery : null);

  const { entrepreneurLocation, consumerLocation } = useOrderTracking({
    orderId: resolvedOrderId,
    isEntrepreneur: true,
    orderStatus,
  });
  const mapCenter =
    entrepreneurLocation ?? consumerLocation ?? DEFAULT_MAP_CENTER;
  const markers = useMemo(
    () =>
      [
        consumerLocation
          ? {
              id: "delivery",
              center: consumerLocation,
              pinClassName: "bg-orange",
            }
          : null,
        entrepreneurLocation
          ? {
              id: "entrepreneur",
              center: entrepreneurLocation,
              pinClassName: "bg-maroon",
            }
          : null,
      ].filter((marker): marker is NonNullable<typeof marker> => Boolean(marker)),
    [consumerLocation, entrepreneurLocation],
  );

  return (
    <LocationMap
      center={mapCenter}
      zoom={17}
      tileStyle={ACTIVE_MAP_STYLE}
      overlayClassName={ACTIVE_MAP_STYLE.overlayClass}
      pinClassName="bg-maroon"
      markerMode="leaflet"
      markers={markers}
      className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-[#f4ebe3]"
    />
  );
}

export default OrderMap;
