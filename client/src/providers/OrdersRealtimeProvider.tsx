/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { supabase } from "../hooks/useSupabase";
import { acquireOrderChannel } from "../lib/orderChannelManager";
import type { OrderResponse, OrderStatus } from "../types/order.types";

export type OrderBroadcastPayload = {
  orderId: number;
  status: OrderStatus;
  consumerId: string;
  entrepreneurId: string;
  totalPrice: number;
  pickupCode: string;
  estimatedDistance: number | null;
  estimatedTime: number | null;
  deliveryNotes: string | null;
  updatedAt: string | null;
  message?: string;
};

const OrdersRealtimeContext = createContext(true);

export const OrdersRealtimeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <OrdersRealtimeContext.Provider value={true}>
      {children}
    </OrdersRealtimeContext.Provider>
  );
};

export const useOrdersRealtime = () => {
  const context = useContext(OrdersRealtimeContext);

  if (!context) {
    throw new Error(
      "useOrdersRealtime must be used within OrdersRealtimeProvider",
    );
  }
};

export const useOrderRealtime = (
  orderId: number | null | undefined,
  handler: (payload: OrderBroadcastPayload) => void,
) => {
  useOrdersRealtime();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!orderId || !Number.isFinite(orderId)) {
      return;
    }

    const subscription = acquireOrderChannel(orderId);

    const removeStatusListener = subscription.addStatusListener((payload) => {
      handlerRef.current(payload);
    });

    return () => {
      removeStatusListener();
      subscription.release();
    };
  }, [orderId]);
};

export const useOrderLocationRealtime = (
  orderId: number | null | undefined,
  handler: (payload: unknown) => void,
) => {
  useOrdersRealtime();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!orderId || !Number.isFinite(orderId)) {
      return;
    }

    const subscription = acquireOrderChannel(orderId);

    const removeLocationListener = subscription.addLocationListener((payload) => {
      handlerRef.current(payload);
    });

    return () => {
      removeLocationListener();
      subscription.release();
    };
  }, [orderId]);
};

export const useOrdersListRealtime = (
  orderIds: number[],
  handler: (payload: OrderBroadcastPayload) => void,
) => {
  useOrdersRealtime();
  const handlerRef = useRef(handler);
  const orderIdsKey = Array.from(new Set(orderIds))
    .filter((orderId) => Number.isFinite(orderId))
    .sort((a, b) => a - b)
    .join(",");

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!orderIdsKey) {
      return;
    }

    const normalizedOrderIds = orderIdsKey
      .split(",")
      .map((orderId) => Number(orderId));
    const subscriptions = normalizedOrderIds.map((orderId) => {
      const subscription = acquireOrderChannel(orderId);
      const removeStatusListener = subscription.addStatusListener((payload) => {
        handlerRef.current(payload);
      });

      return { subscription, removeStatusListener };
    });

    return () => {
      subscriptions.forEach(({ subscription, removeStatusListener }) => {
        removeStatusListener();
        subscription.release();
      });
    };
  }, [orderIdsKey]);
};

export const useEntrepreneurOrdersRealtime = (
  entrepreneurId: string | null | undefined,
  handler: (payload: OrderBroadcastPayload) => void,
) => {
  useOrdersRealtime();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!entrepreneurId) {
      return;
    }

    const channel = supabase.channel(`entrepreneur-${entrepreneurId}`);

    channel.on("broadcast", { event: "order-created" }, ({ payload }) => {
      handlerRef.current(payload as OrderBroadcastPayload);
    });

    channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [entrepreneurId]);
};

export const applyOrderBroadcastPayload = <T extends OrderResponse>(
  order: T,
  payload: OrderBroadcastPayload,
): T => ({
  ...order,
  status: payload.status,
  pickup_code: payload.pickupCode,
  estimated_distance: payload.estimatedDistance,
  estimated_time: payload.estimatedTime,
  delivery_notes: payload.deliveryNotes,
  updated_at: payload.updatedAt,
});
