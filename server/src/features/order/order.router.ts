import { Router } from 'express';
import {
  createOrderController,
  getOrderByIdController,
  getOrdersController,
  updateOrderController,
} from './order.controller.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';

export const orderRouter = Router();

orderRouter.get('/', authMiddleware, getOrdersController);
orderRouter.post('/', authMiddleware, createOrderController);
orderRouter.get('/:id', authMiddleware, getOrderByIdController);
orderRouter.patch('/:id', authMiddleware, updateOrderController);
