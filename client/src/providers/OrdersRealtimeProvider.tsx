/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../hooks/useSupabase";
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

type OrderRealtimeContextValue = {
  subscribeToOrder: (
    orderId: number,
    handler: (payload: OrderBroadcastPayload) => void,
  ) => RealtimeChannel;
  subscribeToEntrepreneurOrders: (
    entrepreneurId: string,
    handler: (payload: OrderBroadcastPayload) => void,
  ) => RealtimeChannel;
  removeChannel: (channel: RealtimeChannel) => void;
};

const orderStatusEvents = [
  "order-status-updated",
  "order-accepted",
  "order-preparing",
  "order-delivering",
  "order-delivered",
  "order-declined",
] as const;

const OrdersRealtimeContext = createContext<OrderRealtimeContextValue | null>(
  null,
);

export const OrdersRealtimeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const value = useMemo<OrderRealtimeContextValue>(
    () => ({
      subscribeToOrder: (orderId, handler) => {
        const channel = supabase.channel(`order-${orderId}`);

        orderStatusEvents.forEach((event) => {
          channel.on("broadcast", { event }, ({ payload }) => {
            handler(payload as OrderBroadcastPayload);
          });
        });

        channel.subscribe();
        return channel;
      },
      subscribeToEntrepreneurOrders: (entrepreneurId, handler) => {
        const channel = supabase
          .channel(`entrepreneur-${entrepreneurId}`)
          .on("broadcast", { event: "order-created" }, ({ payload }) => {
            handler(payload as OrderBroadcastPayload);
          });

        channel.subscribe();
        return channel;
      },
      removeChannel: (channel) => {
        void supabase.removeChannel(channel);
      },
    }),
    [],
  );

  return (
    <OrdersRealtimeContext.Provider value={value}>
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

  return context;
};

export const useOrderRealtime = (
  orderId: number | null | undefined,
  handler: (payload: OrderBroadcastPayload) => void,
) => {
  const { removeChannel, subscribeToOrder } = useOrdersRealtime();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!orderId || !Number.isFinite(orderId)) return;

    const channel = subscribeToOrder(orderId, (payload) => {
      handlerRef.current(payload);
    });

    return () => {
      removeChannel(channel);
    };
  }, [orderId, removeChannel, subscribeToOrder]);
};

export const useOrdersListRealtime = (
  orderIds: number[],
  handler: (payload: OrderBroadcastPayload) => void,
) => {
  const { removeChannel, subscribeToOrder } = useOrdersRealtime();
  const handlerRef = useRef(handler);
  const orderIdsKey = Array.from(new Set(orderIds))
    .filter((orderId) => Number.isFinite(orderId))
    .sort((a, b) => a - b)
    .join(",");

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!orderIdsKey) return;

    const normalizedOrderIds = orderIdsKey
      .split(",")
      .map((orderId) => Number(orderId));
    const channels = normalizedOrderIds.map((orderId) =>
      subscribeToOrder(orderId, (payload) => {
        handlerRef.current(payload);
      }),
    );

    return () => {
      channels.forEach(removeChannel);
    };
  }, [orderIdsKey, removeChannel, subscribeToOrder]);
};

export const useEntrepreneurOrdersRealtime = (
  entrepreneurId: string | null | undefined,
  handler: (payload: OrderBroadcastPayload) => void,
) => {
  const { removeChannel, subscribeToEntrepreneurOrders } = useOrdersRealtime();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!entrepreneurId) return;

    const channel = subscribeToEntrepreneurOrders(
      entrepreneurId,
      (payload) => {
        handlerRef.current(payload);
      },
    );

    return () => {
      removeChannel(channel);
    };
  }, [entrepreneurId, removeChannel, subscribeToEntrepreneurOrders]);
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

// TODO: realtime location will be implemented by another teammate
