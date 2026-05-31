import type { Request, Response, NextFunction } from 'express';

import Boom from '@hapi/boom';

export const errorsMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((err as { code?: string }).code === '23505') {
    return res.status(409).json({
      statusCode: 409,
      error: 'Conflict',
      message: 'Email or phone is already registered',
    });
  }

  const boomError = Boom.isBoom(err) ? err : Boom.boomify(err);

  const payload = {
    ...boomError.output.payload,
    message: err.message,
  };

  return res.status(boomError.output.statusCode).json(payload);
};
