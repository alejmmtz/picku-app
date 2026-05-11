import type { AxiosInstance } from "axios";
import type {
  CreateOrderDTO,
  OrderResponse,
  UpdateOrderDTO,
} from "../types/order.types";

const toNumber = (value: unknown): number => Number(value);

const normalizeCreateOrder = (order: CreateOrderDTO): CreateOrderDTO => {
  return {
    entrepreneur_id: String(order.entrepreneur_id),
    delivery_notes: order.delivery_notes ?? null,
    products: order.products.map((product) => ({
      product_id: toNumber(product.product_id),
      quantity: toNumber(product.quantity),
    })),
  };
};

const normalizeOrder = (order: OrderResponse): OrderResponse => ({
  ...order,
  id: toNumber(order.id),
  total_price: toNumber(order.total_price),
  items: order.items.map((item) => ({
    ...item,
    id: toNumber(item.id),
    product_id: toNumber(item.product_id),
    quantity: toNumber(item.quantity),
    unit_price: toNumber(item.unit_price),
    subtotal: toNumber(item.subtotal),
  })),
});

const extractOrders = (payload: unknown): OrderResponse[] => {
  if (Array.isArray(payload)) {
    return (payload as OrderResponse[]).map(normalizeOrder);
  }

  if (
    payload &&
    typeof payload === "object" &&
    "orders" in payload &&
    Array.isArray((payload as { orders?: unknown }).orders)
  ) {
    return (payload as { orders: OrderResponse[] }).orders.map(normalizeOrder);
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: OrderResponse[] }).data.map(normalizeOrder);
  }

  return [];
};

export const getOrders = async (
  axiosInstance: AxiosInstance,
): Promise<OrderResponse[]> => {
  const response = await axiosInstance.get("/picku/api/orders");
  return extractOrders(response.data);
};

export const getOrderById = async (
  axiosInstance: AxiosInstance,
  orderId: number,
): Promise<OrderResponse> => {
  const response = await axiosInstance.get<OrderResponse>(
    `/picku/api/orders/${orderId}`,
  );

  return normalizeOrder(response.data);
};

export const createOrder = async (
  axiosInstance: AxiosInstance,
  orderData: CreateOrderDTO,
): Promise<OrderResponse> => {
  const response = await axiosInstance.post<OrderResponse>(
    "/picku/api/orders",
    normalizeCreateOrder(orderData),
  );

  return normalizeOrder(response.data);
};

export const updateOrder = async (
  axiosInstance: AxiosInstance,
  orderId: number,
  orderData: UpdateOrderDTO,
): Promise<OrderResponse> => {
  const response = await axiosInstance.patch<OrderResponse>(
    `/picku/api/orders/${orderId}`,
    orderData,
  );

  return normalizeOrder(response.data);
};
