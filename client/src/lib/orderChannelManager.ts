import type { RealtimeChannel } from "@supabase/supabase-js";

import { supabase } from "../hooks/useSupabase";
import type { OrderBroadcastPayload } from "../providers/OrdersRealtimeProvider";
import { ORDER_LOCATION_EVENT, orderLocationChannel } from "../utils/geo";

const orderStatusEvents = [
  "order-status-updated",
  "order-accepted",
  "order-preparing",
  "order-delivering",
  "order-delivered",
  "order-declined",
] as const;

type StatusListener = (payload: OrderBroadcastPayload) => void;
type LocationListener = (payload: unknown) => void;

type ManagedOrderChannel = {
  channel: RealtimeChannel;
  statusListeners: Set<StatusListener>;
  locationListeners: Set<LocationListener>;
  refCount: number;
};

const managedChannels = new Map<number, ManagedOrderChannel>();

const ensureManagedChannel = (orderId: number): ManagedOrderChannel => {
  const existing = managedChannels.get(orderId);

  if (existing) {
    return existing;
  }

  const statusListeners = new Set<StatusListener>();
  const locationListeners = new Set<LocationListener>();

  const channel = supabase.channel(orderLocationChannel(orderId));

  orderStatusEvents.forEach((event) => {
    channel.on("broadcast", { event }, ({ payload }) => {
      statusListeners.forEach((listener) => {
        listener(payload as OrderBroadcastPayload);
      });
    });
  });

  channel.on("broadcast", { event: ORDER_LOCATION_EVENT }, ({ payload }) => {
    locationListeners.forEach((listener) => {
      listener(payload);
    });
  });

  channel.subscribe();

  const managedChannel: ManagedOrderChannel = {
    channel,
    statusListeners,
    locationListeners,
    refCount: 0,
  };

  managedChannels.set(orderId, managedChannel);
  return managedChannel;
};

export const acquireOrderChannel = (orderId: number) => {
  const managedChannel = ensureManagedChannel(orderId);
  managedChannel.refCount += 1;

  return {
    addStatusListener: (listener: StatusListener) => {
      managedChannel.statusListeners.add(listener);
      return () => {
        managedChannel.statusListeners.delete(listener);
      };
    },
    addLocationListener: (listener: LocationListener) => {
      managedChannel.locationListeners.add(listener);
      return () => {
        managedChannel.locationListeners.delete(listener);
      };
    },
    release: () => {
      managedChannel.refCount = Math.max(0, managedChannel.refCount - 1);

      if (managedChannel.refCount === 0) {
        void supabase.removeChannel(managedChannel.channel);
        managedChannels.delete(orderId);
      }
    },
  };
};
