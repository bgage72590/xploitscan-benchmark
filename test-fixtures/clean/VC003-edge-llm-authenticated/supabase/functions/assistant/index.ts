// Row-level-security delegation: the client is built with the CALLER's
// Authorization header. The headers object that forwards it is the one
// headers object maskOutboundAuthNoise must leave alone, or VC003 would lose
// the only evidence this function has.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } },
  );
  const { data } = await supabase.from("notes").select("*");
  return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
});
