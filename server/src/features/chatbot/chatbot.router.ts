import { Router } from 'express';
import { sendMessage, getMessages } from './chatbot.controller.js';

export const chatbotRouter = Router();

chatbotRouter.get('/', getMessages);
chatbotRouter.post('/', sendMessage);
