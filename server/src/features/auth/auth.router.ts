import { Router } from 'express';
import {
  authenticateUserController,
  createUserController,
  deleteUserController,
  updateAuthenticationController,
} from './auth.controller.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';

export const authRouter = Router();
authRouter.post('/login', authenticateUserController);
authRouter.post('/register', createUserController);
authRouter.patch('/me', authMiddleware, updateAuthenticationController);
authRouter.delete('/me', authMiddleware, deleteUserController);
