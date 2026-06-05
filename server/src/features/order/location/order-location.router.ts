import { Router } from 'express';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { validate } from '../../../middlewares/validateSchema.js';
import {
  getOrderLocationController,
  postOrderLocationTrackingController,
} from './order-location.controller.js';
import {
  orderLocationByIdSchema,
  postOrderLocationTrackingSchema,
} from './order-location.schema.js';

export const orderLocationRouter = Router({ mergeParams: true });

orderLocationRouter.get(
  '/:id/location',
  authMiddleware,
  validate(orderLocationByIdSchema),
  getOrderLocationController
);

orderLocationRouter.post(
  '/:id/location/tracking',
  authMiddleware,
  validate(postOrderLocationTrackingSchema),
  postOrderLocationTrackingController
);
