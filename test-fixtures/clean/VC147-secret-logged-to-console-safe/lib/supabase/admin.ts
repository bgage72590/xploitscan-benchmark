import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// TEMP: figuring out why admin inserts fail with "permission denied for table profiles"
console.log("Supabase admin client init", {
  url: supabaseUrl,
  hasServiceRoleKey: Boolean(serviceRoleKey),
});

// Server-only client that bypasses Row Level Security.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
