import axios from "axios";
import { getStoredAuth } from "../../../utils/storage";
import type { ConsumerOrder } from "./orders.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1703";

const getAuthHeaders = () => {
  const token = getStoredAuth()?.session.access_token;

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined;
};

export const fetchOrders = async (): Promise<ConsumerOrder[]> => {
  const { data } = await axios.get<ConsumerOrder[]>(
    `${API_URL}/picku/api/orders`,
    {
      headers: getAuthHeaders(),
    },
  );

  return data;
};

export const fetchOrderById = async (orderId: number): Promise<ConsumerOrder> => {
  const { data } = await axios.get<ConsumerOrder>(
    `${API_URL}/picku/api/orders/${orderId}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return data;
};
