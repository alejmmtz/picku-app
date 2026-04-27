import { createClient } from '@supabase/supabase-js';
import { env } from './index.js';

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

export const supabaseAdmin = env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
  : null;
