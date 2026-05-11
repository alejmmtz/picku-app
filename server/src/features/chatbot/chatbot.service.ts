import Boom from '@hapi/boom';
import { pool } from '../../config/database.js';
import { groqClient } from '../../config/groq.js';
import type { ChatMessage, SendMessageResponse } from './chatbot.types.js';

type AiRecommendationRow = {
  id: string;
  consumer_id: string;
  prompt: string;
  response: string;
  created_at: string;
};

type CatalogContextRow = {
  entrepreneur_name: string;
  entrepreneur_category: string;
  entrepreneur_description: string;
  product_name: string;
  product_category: string;
  product_description: string;
  product_price: string;
};

const ensureUserProfileExists = async (userId: string): Promise<void> => {
  const result = await pool.query<{ id: string }>(
    `SELECT id::text FROM public.users WHERE id = $1`,
    [userId],
  );

  if (!result.rows[0]) {
    throw Boom.forbidden(
      'Tu sesion es valida, pero no encontramos tu perfil en PickU. Registrate o vuelve a iniciar sesion.'
    );
  }
};

const getCatalogContext = async (): Promise<string> => {
  const result = await pool.query<CatalogContextRow>(
    `SELECT
       e.name AS entrepreneur_name,
       e.category AS entrepreneur_category,
       e.description AS entrepreneur_description,
       p.name AS product_name,
       p.category AS product_category,
       p.description AS product_description,
       p.price::text AS product_price
     FROM public.products p
     INNER JOIN public.entrepreneurs e ON e.id = p.entrepreneur_id
     WHERE e.is_active = true AND p.is_available = true
     ORDER BY e.name ASC, p.name ASC
     LIMIT 40`,
  );

  if (result.rows.length === 0) {
    return 'No hay emprendedores o productos disponibles en este momento.';
  }

  return result.rows
    .map((item) => {
      return [
        `Emprendimiento: ${item.entrepreneur_name}`,
        `Categoria del emprendimiento: ${item.entrepreneur_category}`,
        `Descripcion del emprendimiento: ${item.entrepreneur_description}`,
        `Producto: ${item.product_name}`,
        `Categoria del producto: ${item.product_category}`,
        `Descripcion del producto: ${item.product_description}`,
        `Precio: ${item.product_price}`,
      ].join(' | ');
    })
    .join('\n');
};

const mapRecommendationToMessages = (
  recommendation: AiRecommendationRow
): [ChatMessage, ChatMessage] => {
  const question: ChatMessage = {
    id: `${recommendation.id}-question`,
    content: recommendation.prompt,
    role: 'user',
    user_id: recommendation.consumer_id,
    parent_id: null,
    created_at: recommendation.created_at,
  };

  const answer: ChatMessage = {
    id: `${recommendation.id}-answer`,
    content: recommendation.response,
    role: 'assistant',
    user_id: recommendation.consumer_id,
    parent_id: question.id,
    created_at: recommendation.created_at,
  };

  return [question, answer];
};

const createRecommendation = async (
  userId: string,
  prompt: string,
  response: string
): Promise<AiRecommendationRow> => {
  const result = await pool.query<AiRecommendationRow>(
    `INSERT INTO public.ai_recommendation (consumer_id, prompt, response)
     VALUES ($1, $2, $3)
     RETURNING id::text, consumer_id::text, prompt, response, created_at::text`,
    [userId, prompt, response],
  );
  const createdRecommendation = result.rows[0];

  if (!createdRecommendation) {
    throw Boom.badImplementation('Recommendation could not be persisted');
  }

  return createdRecommendation;
};

export const sendMessageService = async (
  userId: string,
  question: string,
): Promise<SendMessageResponse> => {
  await ensureUserProfileExists(userId);
  const catalogContext = await getCatalogContext();

  const completion = await groqClient.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Tu eres Muffiy, el asistente de PickU. Tienes conocimiento de los emprendedores y productos disponibles en la plataforma.

Usa este contexto para responder recomendaciones, precios, categorias y disponibilidad:
${catalogContext}

Responde de manera concisa, amigable y util. Si el usuario pregunta por algo que no aparece en el contexto, dilo con honestidad y sugiere alternativas disponibles.`,
      },
      { role: "user", content: question },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
  });

  const answerContent =
    completion.choices?.[0]?.message?.content ?? 'No response from model';

  const recommendation = await createRecommendation(
    userId,
    question,
    answerContent
  );
  const [questionMsg, answerMsg] = mapRecommendationToMessages(recommendation);

  return { question: questionMsg, answer: answerMsg };
};

export const getMessagesService = async (
  userId: string,
): Promise<ChatMessage[]> => {
  const result = await pool.query<AiRecommendationRow>(
    `SELECT id::text, consumer_id::text, prompt, response, created_at::text
     FROM public.ai_recommendation
     WHERE consumer_id = $1
     ORDER BY created_at ASC, id ASC`,
    [userId],
  );
  return result.rows.flatMap(mapRecommendationToMessages);
};
