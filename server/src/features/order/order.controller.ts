import type { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';
import {
  getOrdersService,
  getOrderByIdService,
  createOrderService,
  updateOrderService,
} from './order.service.js';
import type {
  CreateOrderDTO,
  OrderActorRole,
  UpdateOrderDTO,
} from './order.types.js';
import type { UUID } from '../../shared/storage/shared.types.js';

const resolveActor = (req: Request): { userId: UUID; role: OrderActorRole } => {
  if (!req.authUser) {
    throw Boom.unauthorized('Authenticated user was not found');
  }

  return {
    userId: req.authUser.id as UUID,
    role: req.authUser.role === 'entrepreneur' ? 'entrepreneur' : 'consumer',
  };
};

export const getOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, role } = resolveActor(req);

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
    const actor = resolveActor(req);

    const order = await getOrderByIdService(orderId, actor);
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
    const { userId: consumerId, role } = resolveActor(req);
    const dto = req.body as CreateOrderDTO;

    if (role !== 'consumer') {
      throw Boom.forbidden('Only consumers can create orders');
    }

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
    const actor = resolveActor(req);

    const order = await updateOrderService(orderId, dto, actor);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
