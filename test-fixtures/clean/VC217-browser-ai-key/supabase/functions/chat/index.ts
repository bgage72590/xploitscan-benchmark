// The safe pattern VC217's fix recommends: the provider key is read inside a
// Supabase Edge Function, which runs on the server and never ships to the
// browser. The browser calls this function instead of OpenAI. VC217 must not
// fire (this path is server-only).
import OpenAI from "npm:openai";

Deno.serve(async (req) => {
  const { prompt } = await req.json();
  const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
  });
  return new Response(JSON.stringify(res.choices[0].message), {
    headers: { "content-type": "application/json" },
  });
});
