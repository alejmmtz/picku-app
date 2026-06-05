import type { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';
import { pool } from '../../../config/database.js';
import type { UUID } from '../../../shared/storage/shared.types.js';
import type { OrderActorRole } from '../order.types.js';
import {
  getOrderLocationSnapshot,
  processEntrepreneurLocationBurst,
} from './order-location.service.js';
import type { EntrepreneurLocationBurstDTO } from './order-location.types.js';

const resolveActor = (req: Request): { userId: UUID; role: OrderActorRole } => {
  if (!req.authUser) {
    throw Boom.unauthorized('Authenticated user was not found');
  }

  return {
    userId: req.authUser.id as UUID,
    role: req.authUser.role === 'entrepreneur' ? 'entrepreneur' : 'consumer',
  };
};

const getEntrepreneurIdForOwner = async (userId: UUID): Promise<UUID> => {
  const { rows } = await pool.query<{ id: UUID }>(
    'SELECT id FROM entrepreneurs WHERE student_id = $1',
    [userId]
  );

  const entrepreneurId = rows[0]?.id;

  if (!entrepreneurId) {
    throw Boom.notFound('Entrepreneur not found for this user');
  }

  return entrepreneurId;
};

export const getOrderLocationController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orderId = Number(req.params.id);
    const actor = resolveActor(req);

    const snapshot = await getOrderLocationSnapshot(orderId, actor);
    res.status(200).json(snapshot);
  } catch (error) {
    next(error);
  }
};

export const postOrderLocationTrackingController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orderId = Number(req.params.id);
    const actor = resolveActor(req);

    if (actor.role !== 'entrepreneur') {
      throw Boom.forbidden('Only entrepreneurs can publish live location updates');
    }

    const entrepreneurId = await getEntrepreneurIdForOwner(actor.userId);
    const { updates } = req.body as Pick<
      EntrepreneurLocationBurstDTO,
      'updates'
    >;

    const result = await processEntrepreneurLocationBurst(entrepreneurId, {
      order_id: orderId,
      updates,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
