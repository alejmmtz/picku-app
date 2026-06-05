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
  entrepreneur_id: string;
  entrepreneur_name: string;
  entrepreneur_category: string;
  entrepreneur_description: string;
  product_id: string;
  product_name: string;
  product_category: string;
  product_description: string;
  product_price: string;
};

const ensureUserProfileExists = async (userId: string) => {
  const result = await pool.query<{ id: string }>(
    `SELECT id::text FROM public.users WHERE id = $1`,
    [userId]
  );

  if (!result.rows[0]) {
    throw Boom.forbidden(
      'Tu sesion es valida, pero no encontramos tu perfil en PickU. Registrate o vuelve a iniciar sesion.'
    );
  }

  return true;
};

const getCatalogContext = async () => {
  const result = await pool.query<CatalogContextRow>(
    `SELECT
       e.id::text AS entrepreneur_id,
       e.name AS entrepreneur_name,
       e.category AS entrepreneur_category,
       e.description AS entrepreneur_description,
       p.id::text AS product_id,
       p.name AS product_name,
       p.category AS product_category,
       p.description AS product_description,
       p.price::text AS product_price
     FROM public.products p
     INNER JOIN public.entrepreneurs e ON e.id = p.entrepreneur_id
     WHERE e.is_active = true AND p.is_available = true
     ORDER BY e.name ASC, p.name ASC
     LIMIT 40`
  );

  if (result.rows.length === 0) {
    return 'Actualmente no tenemos emprendedores o productos disponibles, ¡pero seguro llegan nuevos pronto!';
  }

  const baseUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';

  return result.rows
    .map((item) => {
      const businessLink = `${baseUrl}/consumer/business/${item.entrepreneur_id}`;
      const productLink = `${baseUrl}/consumer/product/${item.product_id}`;

      return [
        `Emprendimiento: ${item.entrepreneur_name} (Link: ${businessLink})`,
        `Categoría: ${item.entrepreneur_category}`,
        `Producto: ${item.product_name} (Link: ${productLink})`,
        `Detalle: ${item.product_description}`,
        `Precio: $${item.product_price}`,
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
) => {
  const result = await pool.query<AiRecommendationRow>(
    `INSERT INTO public.ai_recommendation (consumer_id, prompt, response)
     VALUES ($1, $2, $3)
     RETURNING id::text, consumer_id::text, prompt, response, created_at::text`,
    [userId, prompt, response]
  );
  const createdRecommendation = result.rows[0];

  if (!createdRecommendation) {
    throw Boom.badImplementation(
      'No se pudo guardar la recomendación en la base de datos'
    );
  }

  return createdRecommendation;
};

export const sendMessageService = async (userId: string, question: string) => {
  await ensureUserProfileExists(userId);
  const catalogContext = await getCatalogContext();

  const completion = await groqClient.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `¡Hola! Eres Muffiy, el asistente virtual estrella, súper amigable y charlón de PickU. 

PickU es una plataforma increíble que conecta a estudiantes consumidores con talentosos emprendedores universitarios. Sabes que los usuarios usan la app para pedir comida, ropa u otros productos, reunirse en puntos clave del campus (campus locations) y confirmar sus entregas con códigos de retiro (pickup codes).

Aquí tienes el catálogo actual (emprendedores, productos y sus LINKS) para que ayudes al usuario:
${catalogContext}

TUS REGLAS DE ORO:
1. Sé súper empático, entusiasta y cálido. No uses emojis y habla como si estuvieras charlando con un compañero en la universidad.
2. Anima siempre a apoyar a los emprendedores locales estudiantiles.

4. Si el usuario pide algo que no está en el catálogo, usa tu creatividad: dile la verdad de forma amigable ("¡Uy! Por ahora no tengo de eso...") y recomiéndale inmediatamente las alternativas más similares que SÍ tenemos .
5. Responde de forma fluida, con respuestas útiles pero no robóticas. Eres libre de hacer bromas ligeras si el contexto lo permite.`,
      },
      { role: 'user', content: question },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.85,
  });

  const answerContent =
    completion.choices?.[0]?.message?.content ??
    '¡Ups! Me quedé sin palabras. ¿Me repites la pregunta?';

  const recommendation = await createRecommendation(
    userId,
    question,
    answerContent
  );

  const [questionMsg, answerMsg] = mapRecommendationToMessages(recommendation);

  return { question: questionMsg, answer: answerMsg };
};

export const getMessagesService = async (userId: string) => {
  const result = await pool.query<AiRecommendationRow>(
    `SELECT id::text, consumer_id::text, prompt, response, created_at::text
     FROM public.ai_recommendation
     WHERE consumer_id = $1
     ORDER BY created_at ASC, id ASC`,
    [userId]
  );

  return result.rows.flatMap(mapRecommendationToMessages);
};
