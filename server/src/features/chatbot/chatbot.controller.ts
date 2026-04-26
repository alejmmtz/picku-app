import type { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';
import { sendMessageService, getMessagesService } from './chatbot.service.js';

export const sendMessage = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const { question } = req.body;

  if (!question || typeof question !== "string" || !question.trim()) {
    throw Boom.badRequest(
      "question is required and must be a non-empty string",
    );
  }

  const message = await sendMessageService(question.trim());
  res.status(201).json(message);
};

export const getMessages = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const messages = await getMessagesService();
  res.json(messages);
};
