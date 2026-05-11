import { Router } from 'express';
import { sendMessage, getMessages } from './chatbot.controller.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';

export const chatbotRouter = Router();

chatbotRouter.get('/', authMiddleware, getMessages);
chatbotRouter.post('/', authMiddleware, sendMessage);
