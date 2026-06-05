export const ORDER_LOCATION_CHANNEL_PREFIX = 'order-';

export const ORDER_LOCATION_EVENT = 'location-update';

export const orderLocationChannel = (orderId: number): string =>
  `${ORDER_LOCATION_CHANNEL_PREFIX}${orderId}`;
