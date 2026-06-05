import type { Request, Response, NextFunction } from 'express';

import Boom from '@hapi/boom';

export const errorsMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const boomError = Boom.isBoom(err) ? err : Boom.boomify(err);

  const payload = {
    ...boomError.output.payload,
    message: err.message,
  };

  return res.status(boomError.output.statusCode).json(payload);
};
