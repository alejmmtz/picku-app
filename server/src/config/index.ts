import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(6543),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),

  SUPABASE_URL: z.url('The SUPABASE_URL is not a valid URL'),
  SUPABASE_KEY: z.string().min(10, 'The SUPABASE_KEY is invalid or too short'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(10).optional(),
  GROQ_API_KEY: z.string().min(10).optional(),
});

const envConfig = envSchema.safeParse(process.env);

if (!envConfig.success) {
  console.error('ENV ERROR: ', envConfig.error);
  process.exit(1);
}

export const env = envConfig.data;
