import { z } from 'zod';

import { OrderStatus } from './order.types.js';

const IcesiCoordinates = {
  minLatitude: 3.338,
  maxLatitude: 3.345,
  minLongitude: -76.533,
  maxLongitude: -76.527,
} as const;

export const orderStatusSchema = z.enum(OrderStatus);

export const geoPointSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export const boundedCampusGeoPointSchema = geoPointSchema.superRefine(
  (coordinates, context) => {
    const validLatitude =
      coordinates.latitude >= IcesiCoordinates.minLatitude &&
      coordinates.latitude <= IcesiCoordinates.maxLatitude;

    const validLongitude =
      coordinates.longitude >= IcesiCoordinates.minLongitude &&
      coordinates.longitude <= IcesiCoordinates.maxLongitude;

    if (!validLatitude || !validLongitude) {
      context.addIssue({
        code: 'custom',
        message: 'The user position is outside the configured campus bounds.',
      });
    }
  }
);

export const productItemSchema = z.object({
  product_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const createOrderBodySchema = z.object({
  entrepreneur_id: z.uuid(),
  delivery_notes: z.string().trim().min(1).nullable().optional(),
  products: z.array(productItemSchema).min(1),
  campus_location_id: z.number().int().positive().nullable().optional(),
  user_position: boundedCampusGeoPointSchema,
});

export const createOrderSchema = z.object({
  body: createOrderBodySchema,
  params: z.object({}),
  query: z.object({}),
});

export const updateOrderBodySchema = z
  .object({
    status: orderStatusSchema.optional(),
    pickup_code: z.string().trim().min(1).optional(),
    cancel_reason: z.string().trim().min(1).nullable().optional(),
  })
  .refine(
    (body) =>
      body.status !== undefined ||
      body.pickup_code !== undefined ||
      body.cancel_reason !== undefined,
    {
      message: 'At least one field must be provided to update an order.',
      path: [],
    }
  )
  .superRefine((body, context) => {
    if (body.status === OrderStatus.DECLINED && !body.cancel_reason) {
      context.addIssue({
        code: 'custom',
        message: 'You need a reason to decline the order.',
        path: ['cancel_reason'],
      });
    }
  });

export const updateOrderSchema = z.object({
  body: updateOrderBodySchema,
  params: z.object({
    id: z.coerce.number().int().positive().optional(),
  }),
  query: z.object({}),
});

export const customerSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1),
  phone: z.string().trim().min(1),
});

export const entrepreneurSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1),
  category: z.string().trim().min(1),
  contact_info: z.string().trim().min(1),
  img: z.url(),
  entrepreneur_position: geoPointSchema.nullable(),
  campus_location_id: z.number().int().positive().nullable(),
});

export const trackingSchema = z.object({
  estimated_distance: z.number().nullable(),
  estimated_time: z.number().int().nullable(),
  user_position: geoPointSchema.nullable(),
  campus_location_id: z.number().int().positive().nullable(),
  location_name: z.string().trim().min(1).nullable(),
});

export const orderItemsSchema = z.object({
  id: z.number().int().positive(),
  product_id: z.number().int().positive(),
  name: z.string().trim().min(1),
  quantity: z.number().int().positive(),
  unit_price: z.number().int().nonnegative(),
  subtotal: z.number().int().nonnegative(),
  img: z.url(),
});

export const orderSchema = z.object({
  id: z.number().int().positive(),
  consumer_id: z.uuid(),
  entrepreneur_id: z.uuid(),
  status: orderStatusSchema,
  total_price: z.number().int().nonnegative(),
  pickup_code: z.string().trim().min(1),
  estimated_distance: z.number().nullable(),
  estimated_time: z.number().int().nullable(),
  delivery_notes: z.string().trim().min(1).nullable(),
  cancel_reason: z.string().trim().min(1).nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().nullable(),
  campus_location_id: z.number().int().positive().nullable(),
  user_position: geoPointSchema.nullable(),
  items: z.array(orderItemsSchema).optional(),
});

export const orderResponseSchema = z.object({
  id: z.number().int().positive(),
  status: orderStatusSchema,
  total_price: z.number().int().nonnegative(),
  pickup_code: z.string().trim().min(1),
  delivery_notes: z.string().trim().min(1).nullable(),
  cancel_reason: z.string().trim().min(1).nullable(),
  customer: customerSchema,
  entrepreneur: entrepreneurSchema,
  tracking: trackingSchema,
  items: z.array(orderItemsSchema),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().nullable(),
});
