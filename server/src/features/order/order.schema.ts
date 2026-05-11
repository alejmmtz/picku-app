import { z } from 'zod';

import { OrderStatus } from './order.types.js';

export const orderStatusSchema = z.enum(OrderStatus);

export const productItemSchema = z.object({
  product_id: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
});

export const createOrderBodySchema = z.object({
  entrepreneur_id: z.uuid(),
  delivery_notes: z.string().trim().min(1).nullable().optional(),
  products: z.array(productItemSchema).min(1),
});

export const createOrderSchema = z.object({
  body: createOrderBodySchema,
  params: z.object({}),
  query: z.object({}),
});

export const orderByIdSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
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

    if (body.status === OrderStatus.DELIVERED && !body.pickup_code) {
      context.addIssue({
        code: 'custom',
        message: 'Pickup code is required to complete the order.',
        path: ['pickup_code'],
      });
    }
  });

export const updateOrderSchema = z.object({
  body: updateOrderBodySchema,
  params: z.object({
    id: z.coerce.number().int().positive(),
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
  delivery_notes: z.string().trim().min(1).nullable(),
  cancel_reason: z.string().trim().min(1).nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().nullable(),
  items: z.array(orderItemsSchema).optional(),
});

export const orderResponseSchema = z.object({
  id: z.number().int().positive(),
  consumer_id: z.uuid(),
  entrepreneur_id: z.uuid(),
  status: orderStatusSchema,
  total_price: z.number().int().nonnegative(),
  pickup_code: z.string().trim().min(1),
  delivery_notes: z.string().trim().min(1).nullable(),
  cancel_reason: z.string().trim().min(1).nullable(),
  customer: customerSchema,
  entrepreneur: entrepreneurSchema,
  items: z.array(orderItemsSchema),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().nullable(),
});
