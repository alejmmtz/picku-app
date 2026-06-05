import { useCallback, useEffect, useRef, useState } from "react";

import { useAxios } from "../providers/AxiosProvider";
import { useOrderLocationRealtime } from "../providers/OrdersRealtimeProvider";
import type { MapCenter } from "../providers/MapsProvider";
import {
  getOrderLocationSnapshot,
  postOrderLocationTracking,
} from "../services/order.service";
import {
  isSameMapCenter,
  toBackendCoordinates,
  toMapCenter,
} from "../utils/geo";

const TRACKING_THROTTLE_MS = 2000;
const MAX_SYNCED_ACCURACY_METERS = 500;

const ACTIVE_TRACKING_STATUSES = new Set([
  "accepted",
  "preparing",
  "delivering",
]);

type UseOrderTrackingOptions = {
  orderId: number | null | undefined;
  isEntrepreneur: boolean;
  orderStatus?: string | null;
};

export function useOrderTracking({
  orderId,
  isEntrepreneur,
  orderStatus,
}: UseOrderTrackingOptions) {
  const api = useAxios();
  const [entrepreneurLocation, setEntrepreneurLocation] =
    useState<MapCenter | null>(null);
  const [consumerLocation, setConsumerLocation] = useState<MapCenter | null>(
    null,
  );
  const lastSyncRef = useRef(0);
  const watchIdRef = useRef<number | undefined>(undefined);

  const applyEntrepreneurLocation = useCallback((coords: MapCenter | null) => {
    if (!coords) {
      return;
    }

    setEntrepreneurLocation((current) =>
      isSameMapCenter(current, coords) ? current : coords,
    );
  }, []);

  const handleLocationBroadcast = useCallback(
    (payload: unknown) => {
      const coords = toMapCenter(payload);

      if (!coords) {
        return;
      }

      applyEntrepreneurLocation(coords);
    },
    [applyEntrepreneurLocation],
  );

  useOrderLocationRealtime(orderId, handleLocationBroadcast);

  useEffect(() => {
    if (!orderId || !Number.isFinite(orderId)) {
      return;
    }

    let isMounted = true;

    const loadSnapshot = async () => {
      try {
        const snapshot = await getOrderLocationSnapshot(api, orderId);

        if (!isMounted) {
          return;
        }

        if (snapshot.entrepreneur_position) {
          applyEntrepreneurLocation({
            lat: snapshot.entrepreneur_position.latitude,
            lng: snapshot.entrepreneur_position.longitude,
          });
        }

        if (snapshot.user_position) {
          setConsumerLocation({
            lat: snapshot.user_position.latitude,
            lng: snapshot.user_position.longitude,
          });
        }
      } catch (error) {
        console.warn("Could not load order location snapshot:", error);
      }
    };

    void loadSnapshot();

    return () => {
      isMounted = false;
    };
  }, [api, applyEntrepreneurLocation, orderId]);

  useEffect(() => {
    if (watchIdRef.current !== undefined) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = undefined;
    }

    if (
      !isEntrepreneur ||
      !orderId ||
      !Number.isFinite(orderId) ||
      !orderStatus ||
      !ACTIVE_TRACKING_STATUSES.has(orderStatus)
    ) {
      return;
    }

    if (!("geolocation" in navigator)) {
      console.warn("Geolocation is not supported in this browser");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const nextLocation: MapCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        applyEntrepreneurLocation(nextLocation);

        const now = Date.now();
        if (now - lastSyncRef.current < TRACKING_THROTTLE_MS) {
          return;
        }

        lastSyncRef.current = now;

        const accuracy = position.coords.accuracy;
        const trackingUpdate: {
          position: ReturnType<typeof toBackendCoordinates>;
          captured_at: string;
          accuracy_meters?: number;
        } = {
          position: toBackendCoordinates(nextLocation),
          captured_at: new Date(position.timestamp).toISOString(),
        };

        if (
          Number.isFinite(accuracy) &&
          accuracy > 0 &&
          accuracy <= MAX_SYNCED_ACCURACY_METERS
        ) {
          trackingUpdate.accuracy_meters = accuracy;
        }

        void postOrderLocationTracking(api, orderId, {
          updates: [
            trackingUpdate,
          ],
        }).catch((error: unknown) => {
          console.warn("Failed to sync entrepreneur location:", error);
        });
      },
      (error) => {
        console.warn("GPS tracking error:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 10000,
      },
    );

    return () => {
      if (watchIdRef.current !== undefined) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = undefined;
      }
    };
  }, [
    api,
    applyEntrepreneurLocation,
    isEntrepreneur,
    orderId,
    orderStatus,
  ]);

  return {
    entrepreneurLocation,
    consumerLocation,
    /** @deprecated Use entrepreneurLocation or consumerLocation explicitly */
    liveLocation: entrepreneurLocation,
  };
}
