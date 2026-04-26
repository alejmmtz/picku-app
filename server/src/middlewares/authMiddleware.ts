import Boom from '@hapi/boom';
import type { NextFunction, Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    throw Boom.unauthorized('Authorization header is required');
  }

  if (!authorizationHeader.startsWith('Bearer ')) {
    throw Boom.unauthorized('Authorization header must use Bearer token');
  }

  const token = authorizationHeader.replace('Bearer ', '').trim();

  if (!token) {
    throw Boom.unauthorized('Access token is required');
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw Boom.unauthorized('Invalid or expired token');
  }

  const authUser: Request['authUser'] = {
    id: data.user.id,
    email: data.user.email ?? '',
  };

  if (typeof data.user.user_metadata?.role === 'string') {
    authUser.role = data.user.user_metadata.role;
  }

  req.authUser = authUser;

  next();
};
