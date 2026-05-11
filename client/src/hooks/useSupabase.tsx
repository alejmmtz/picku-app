import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidSupabaseUrl = (value: string | undefined): value is string => {
  if (!value) return false;

  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

const isValidSupabaseKey = (value: string | undefined): value is string => {
  if (!value) return false;

  const trimmedValue = value.trim();
  if (!trimmedValue) return false;

  return !/^X+$/i.test(trimmedValue);
};

const missingSupabaseClient = new Proxy({} as SupabaseClient, {
  get() {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_KEY to client/.env.",
    );
  },
});

export const supabase =
  isValidSupabaseUrl(supabaseUrl) && isValidSupabaseKey(supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : missingSupabaseClient;
