// "Admin" Supabase client in browser code. The service-role key bypasses Row
// Level Security, and the VITE_ prefix puts it in the public bundle, so any
// visitor can read and write every table. VC217 must fire on the reference.
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(url, serviceRoleKey);
