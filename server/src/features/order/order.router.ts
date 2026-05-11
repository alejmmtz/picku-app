import { Router } from 'express';
import {
  createOrderController,
  getOrderByIdController,
  getOrdersController,
  updateOrderController,
} from './order.controller.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';
import { validate } from '../../middlewares/validateSchema.js';
import {
  createOrderSchema,
  orderByIdSchema,
  updateOrderSchema,
} from './order.schema.js';

export const orderRouter = Router();

orderRouter.get('/', authMiddleware, getOrdersController);
orderRouter.post('/', authMiddleware, validate(createOrderSchema), createOrderController);
orderRouter.get('/:id', authMiddleware, validate(orderByIdSchema), getOrderByIdController);
orderRouter.patch('/:id', authMiddleware, validate(updateOrderSchema), updateOrderController);
