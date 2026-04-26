import Boom from '@hapi/boom';
import type { Request, Response } from 'express';
import {
  authenticateUserService,
  createUserService,
  deleteUserService,
  updateAuthenticationService,
} from './auth.service.js';
import {
  authenticateUserSchema,
  createUserSchema,
  updateUserSchema,
} from './auth.types.js';

export const authenticateUserController = async (
  req: Request,
  res: Response
) => {
  const parsedBody = authenticateUserSchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw Boom.badRequest(parsedBody.error.issues[0]?.message ?? 'Invalid body');
  }

  const user = await authenticateUserService(parsedBody.data);
  return res.json(user);
};

export const createUserController = async (req: Request, res: Response) => {
  const parsedBody = createUserSchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw Boom.badRequest(parsedBody.error.issues[0]?.message ?? 'Invalid body');
  }

  const user = await createUserService(parsedBody.data);

  return res.status(201).json(user);
};

export const updateAuthenticationController = async (
  req: Request,
  res: Response
) => {
  if (!req.authUser) {
    throw Boom.unauthorized('Authenticated user was not found');
  }

  const parsedBody = updateUserSchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw Boom.badRequest(parsedBody.error.issues[0]?.message ?? 'Invalid body');
  }

  const updatedUser = await updateAuthenticationService(
    req.authUser.id,
    parsedBody.data
  );

  return res.json(updatedUser);
};

export const deleteUserController = async (req: Request, res: Response) => {
  if (!req.authUser) {
    throw Boom.unauthorized('Authenticated user was not found');
  }

  const result = await deleteUserService(req.authUser.id);
  return res.json(result);
};
