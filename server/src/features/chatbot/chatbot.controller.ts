import type { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';
import { sendMessageService, getMessagesService } from './chatbot.service.js';
import { createMessageSchema } from './chatbot.types.js';

export const sendMessage = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (!req.authUser) {
    throw Boom.unauthorized('Authenticated user was not found');
  }

  const parsedBody = createMessageSchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw Boom.badRequest(parsedBody.error.issues[0]?.message ?? 'Invalid body');
  }

  const message = await sendMessageService(
    req.authUser.id,
    parsedBody.data.question,
  );
  res.status(201).json(message);
};

export const getMessages = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (!req.authUser) {
    throw Boom.unauthorized('Authenticated user was not found');
  }

  const messages = await getMessagesService(req.authUser.id);
  res.json(messages);
};
