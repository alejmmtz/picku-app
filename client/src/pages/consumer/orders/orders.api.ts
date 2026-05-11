import axiosConfig from "../../../config/axiosConfig";
import {
  getOrderById,
  getOrders,
} from "../../../services/order.service";

export const fetchOrders = async () => {
  return getOrders(axiosConfig);
};

export const fetchOrderById = async (orderId: number) => {
  return getOrderById(axiosConfig, orderId);
};
