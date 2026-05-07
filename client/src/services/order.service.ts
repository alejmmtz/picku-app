import type { AxiosInstance } from "axios";
import type { CreateOrderDTO } from "../types/order.types";

export const createOrder = async (
  axiosInstance: AxiosInstance,
  orderData: CreateOrderDTO
) => {
  const response = await axiosInstance.post("/picku/api/orders", orderData);
  return response.data;
};