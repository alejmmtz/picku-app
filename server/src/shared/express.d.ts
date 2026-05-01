// src/types/express.d.ts
import type { UUID } from '../shared/storage/shared.types.js';

declare global {
  namespace Express {
    interface Request {
      authUser: {
        id: UUID;
        email: string;
        role?: string;
      };
    }
  }
}
