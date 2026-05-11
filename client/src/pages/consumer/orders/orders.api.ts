import axiosConfig from "../../../config/axiosConfig";
import { getStoredAuth } from "../../../utils/storage";
import type { ConsumerOrder } from "./orders.types";

const extractOrders = (payload: unknown): ConsumerOrder[] => {
  if (Array.isArray(payload)) {
    return payload as ConsumerOrder[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    "orders" in payload &&
    Array.isArray((payload as { orders?: unknown }).orders)
  ) {
    return (payload as { orders: ConsumerOrder[] }).orders;
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: ConsumerOrder[] }).data;
  }

  return [];
};

const getAuthHeaders = () => {
  const token = getStoredAuth()?.session.access_token;

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined;
};

export const fetchOrders = async (): Promise<ConsumerOrder[]> => {
  const { data } = await axiosConfig.get(
    `/picku/api/orders`,
    {
      headers: getAuthHeaders(),
    },
  );

  return extractOrders(data);
};

export const fetchOrderById = async (orderId: number): Promise<ConsumerOrder> => {
  const { data } = await axiosConfig.get<ConsumerOrder>(
    `/picku/api/orders/${orderId}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return data;
};
