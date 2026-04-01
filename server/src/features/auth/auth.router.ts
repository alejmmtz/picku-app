import { Router } from 'express';
import {
  authenticateUserController,
  createUserController,
} from './auth.controller.js';

export const authRouter = Router();
authRouter.post('/login', authenticateUserController);
authRouter.post('/register', createUserController);
