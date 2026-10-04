// Public-by-design configuration a Vite app is meant to ship: the Supabase URL
// and publishable/anon keys, model and assistant identifiers, and a key that
// is only read in development builds (Vite replaces import.meta.env.DEV with
// false in production and the minifier drops the branch). VC217 must not fire.
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
export const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const model = import.meta.env.VITE_OPENAI_MODEL;
export const assistant = import.meta.env.VITE_OPENAI_ASSISTANT_ID;
export const maxTokens = Number(import.meta.env.VITE_OPENAI_TOKEN_LIMIT ?? 512);
export const devKey = import.meta.env.DEV ? import.meta.env.VITE_OPENAI_API_KEY : "";
