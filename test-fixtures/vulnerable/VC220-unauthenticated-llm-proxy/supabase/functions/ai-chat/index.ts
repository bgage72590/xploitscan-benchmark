// Lovable's AI chat edge function shape: the browser's messages go straight
// to the AI gateway on the workspace's credits. verify_jwt = true in
// config.toml, but the public anon key passes that check.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const { messages } = await req.json();
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "google/gemini-2.5-flash", messages, stream: true }),
  });
  return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
});
