import Boom from '@hapi/boom';
import type { Request, Response } from 'express';
import { authenticateUserService, createUserService } from './auth.service.js';
import { UserRole } from './auth.types.js';

export const authenticateUserController = async (
  req: Request,
  res: Response
) => {
  if (!req.body) {
    throw Boom.badRequest('Request body is required');
  }

  const { email, password } = req.body;

  if (email === undefined) {
    throw Boom.badRequest('Email is required');
  }

  if (password === undefined) {
    throw Boom.badRequest('Password is required');
  }

  const user = await authenticateUserService({ email, password });
  return res.json(user);
};

export const createUserController = async (req: Request, res: Response) => {
  if (!req.body) {
    throw Boom.badRequest('Request body is required');
  }

  const { email, password, name, role, phone } = req.body;

  if (email === undefined) {
    throw Boom.badRequest('Email is required');
  }

  if (password === undefined) {
    throw Boom.badRequest('Password is required');
  }

  if (name === undefined) {
    throw Boom.badRequest('Name is required');
  }

  if (!Object.values(UserRole).includes(role)) {
    throw Boom.badRequest(
      `Role must be one of: ${Object.values(UserRole).join(', ')}`
    );
  }

  if (phone === undefined) {
    throw Boom.badRequest('Phone is required');
  }

  const user = await createUserService({
    email,
    name,
    password,
    role,
    phone,
  });

  return res.status(201).json(user);
};
