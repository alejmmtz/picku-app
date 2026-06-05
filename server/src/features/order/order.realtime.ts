import { broadcastHttp } from '../../shared/realtime/broadcast.js';
import { orderLocationChannel } from './location/order-location.constants.js';
import type { OrderResponseDTO, OrderStatus } from './order.types.js';

type OrderBroadcastPayload = {
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

const statusMessages: Record<OrderStatus, string> = {
  requested: 'Pedido solicitado',
  accepted: 'Tu pedido fue aceptado',
  preparing: 'Tu pedido esta en preparacion',
  delivering: 'Tu pedido va en camino',
  delivered: 'Tu pedido fue entregado',
  declined: 'Tu pedido fue rechazado',
};

const statusEvents: Partial<Record<OrderStatus, string>> = {
  accepted: 'order-accepted',
  preparing: 'order-preparing',
  delivering: 'order-delivering',
  delivered: 'order-delivered',
  declined: 'order-declined',
};

const toIsoString = (value: Date | string | null | undefined) => {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
};

const buildOrderPayload = (order: OrderResponseDTO): OrderBroadcastPayload => ({
  orderId: Number(order.id),
  status: order.status,
  consumerId: order.consumer_id,
  entrepreneurId: order.entrepreneur_id,
  totalPrice: Number(order.total_price),
  pickupCode: order.pickup_code,
  estimatedDistance: order.estimated_distance ?? null,
  estimatedTime: order.estimated_time ?? null,
  deliveryNotes: order.delivery_notes ?? null,
  updatedAt: toIsoString(order.updated_at),
  message: statusMessages[order.status],
});

// POR AQUI ALEJO HARA LA UBICACION EN TIEMPO REAL DE LOS PEDIDOS, PARA QUE EL CONSUMIDOR PUEDA VER EN UN MAPA DONDE ESTA SU PEDIDO EN CADA MOMENTO, PARA ESO NECESITAMOS CREAR UN NUEVO CANAL DE SUPABASE QUE SE LLAME order-{orderId} Y EN ESE CANAL VAMOS A ENVIAR LA UBICACION DEL PEDIDO CADA VEZ QUE SE ACTUALICE, ASI EL CONSUMIDOR PODRA VER EN TIEMPO REAL DONDE ESTA SU PEDIDO, ADEMAS DE LOS ESTADOS DEL PEDIDO QUE YA TENEMOS IMPLEMENTADOS

const sendBroadcast = async (
  channelName: string,
  event: string,
  payload: OrderBroadcastPayload
) => {
  await broadcastHttp(channelName, event, payload);
};

export const broadcastOrderCreated = async (
  order: OrderResponseDTO
): Promise<void> => {
  const payload = buildOrderPayload(order);

  await sendBroadcast(
    `entrepreneur-${order.entrepreneur_id}`,
    'order-created',
    payload
  );
};

export const broadcastOrderStatusUpdated = async (
  order: OrderResponseDTO
): Promise<void> => {
  const payload = buildOrderPayload(order);
  const orderChannel = orderLocationChannel(order.id);

  await sendBroadcast(orderChannel, 'order-status-updated', payload);

  const statusEvent = statusEvents[order.status];

  if (statusEvent) {
    await sendBroadcast(orderChannel, statusEvent, payload);
  }
};
