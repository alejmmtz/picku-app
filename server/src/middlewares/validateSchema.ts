import type { Request, Response, NextFunction } from 'express';
import * as z from 'zod';

export const validate =
  (schema: z.ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      Object.assign(req, parsed);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: 'error',
          errors: z.treeifyError(error),
        });
      }
      next(error);
    }
  };
