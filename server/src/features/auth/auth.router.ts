import { Router } from 'express';
import {
  authenticateUserController,
  createUserController,
  deleteUserController,
  getCurrentUserProfileController,
  updateAuthenticationController,
} from './auth.controller.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';

export const authRouter = Router();
authRouter.post('/login', authenticateUserController);
authRouter.post('/register', createUserController);
authRouter.get('/me', authMiddleware, getCurrentUserProfileController);
authRouter.patch('/me', authMiddleware, updateAuthenticationController);
authRouter.delete('/me', authMiddleware, deleteUserController);
