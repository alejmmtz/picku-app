import { z } from 'zod';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  parent_id: string | null;
  created_at: string;
}

export interface SendMessageResponse {
  question: ChatMessage;
  answer: ChatMessage;
}

export const createMessageSchema = z.object({
  question: z.string().trim().min(1, 'question is required'),
});

export type CreateMessageDTO = z.infer<typeof createMessageSchema>;
