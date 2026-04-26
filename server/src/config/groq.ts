import Boom from '@hapi/boom';
import { env } from './index.js';

type GroqMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type GroqChatCompletionRequest = {
  messages: GroqMessage[];
  model: string;
  temperature?: number;
};

type GroqChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

const create = async (
  body: GroqChatCompletionRequest
): Promise<GroqChatCompletionResponse> => {
  if (!env.GROQ_API_KEY) {
    throw Boom.internal('GROQ_API_KEY is not configured');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw Boom.badImplementation(`Groq request failed: ${errorText}`);
  }

  return (await response.json()) as GroqChatCompletionResponse;
};

export const groqClient = {
  chat: {
    completions: {
      create,
    },
  },
};
