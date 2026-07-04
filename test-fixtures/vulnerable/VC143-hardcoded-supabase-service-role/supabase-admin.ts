// Supabase admin client with the SERVICE ROLE key baked into source.
// Service role keys bypass Row Level Security — leaking one hands an
// attacker full read/write access to every row in every table.
// If this file ends up client-bundled (import from a component), every
// visitor gets admin access to your DB. VC143 must fire.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByb2pyZWYiLCJyb2xlIjoic2VydmljZV9yb2xlIn0.abcdefghijklmnopqrstuvwxyz";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY
);
