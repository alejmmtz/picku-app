import type { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';
import { sendMessageService, getMessagesService } from './chatbot.service.js';
import { createMessageSchema } from './chatbot.types.js';

export const sendMessage = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const parsedBody = createMessageSchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw Boom.badRequest(parsedBody.error.issues[0]?.message ?? 'Invalid body');
  }

  const message = await sendMessageService(parsedBody.data.question);
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
