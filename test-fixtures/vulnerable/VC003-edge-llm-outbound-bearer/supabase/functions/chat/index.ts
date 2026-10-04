// The chat edge function AI app builders scaffold: it forwards the browser's
// messages to Lovable's AI gateway with the OWNER's key and never checks who
// is calling. VC003 used to read three things here as authentication, none
// of which identifies the caller:
//   - the outbound `Authorization: Bearer ${LOVABLE_API_KEY}` header;
//   - `role: "user"` in the messages it forwards;
//   - the word "user" in its own system prompt.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = "You are a friendly assistant. Answer the user's question in two short paragraphs.";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const { messages } = await req.json();
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages, { role: "user", content: "Be brief." }],
      stream: true,
    }),
  });

  if (response.status === 429) {
    return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
});
