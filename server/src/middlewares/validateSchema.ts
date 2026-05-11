import type { Request, Response, NextFunction } from 'express';
import * as z from 'zod';

export const validate =
  (schema: z.ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body ?? {},
        query: req.query ?? {},
        params: req.params ?? {},
      })) as {
        body: Request['body'];
        query: Request['query'];
        params: Request['params'];
      };

      req.body = parsed.body;
      req.params = parsed.params;

      Object.defineProperty(req, 'query', {
        value: parsed.query,
        writable: true,
        configurable: true,
        enumerable: true,
      });

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: 'error',
          message: error.issues[0]?.message ?? 'Invalid request payload',
          errors: z.treeifyError(error),
        });
      }
      next(error);
    }
  };
