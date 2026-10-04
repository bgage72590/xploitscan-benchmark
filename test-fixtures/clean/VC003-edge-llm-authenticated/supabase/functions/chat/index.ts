// The same gateway proxy, done right: the caller's token is resolved with
// getUser() and the function stops with a 401 before it spends anything.
// It still carries the outbound Bearer header and `role: "user"`; masking
// those must not cost the real evidence below.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  const { messages } = await req.json();
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "google/gemini-2.5-flash", messages: [...messages, { role: "user", content: "Be brief." }] }),
  });
  return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
});
