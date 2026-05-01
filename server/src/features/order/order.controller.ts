import type { Request, Response, NextFunction } from 'express';
import {
  getOrdersService,
  getOrderByIdService,
  createOrderService,
  updateOrderService,
} from './order.service.js';
import type { CreateOrderDTO, UpdateOrderDTO } from './order.types.js';
import type { UUID } from '../../shared/storage/shared.types.js';

export const getOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.authUser.id as UUID;
    const role = req.authUser.role as 'consumer' | 'entrepreneur';

    const orders = await getOrdersService(userId, role);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orderId = Number(req.params.id);

    const order = await getOrderByIdService(orderId);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const consumerId = req.authUser.id as UUID;
    const dto = req.body as CreateOrderDTO;

    const order = await createOrderService(dto, consumerId);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orderId = Number(req.params.id);
    const dto = req.body as UpdateOrderDTO;

    const order = await updateOrderService(orderId, dto);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
