import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Client scoped to the caller's own session: RLS applies to everything it reads.
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } },
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { noteId } = await req.json();
  const { data: note, error } = await supabase.from("notes").select("content").eq("id", noteId).single();
  if (error || !note) {
    return new Response(JSON.stringify({ error: "Note not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // The OpenAI key lives in the function's secrets; the model is fixed here.
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Summarize the user's note in three bullet points." },
        { role: "user", content: note.content },
      ],
    }),
  });

  const result = await response.json();
  return new Response(JSON.stringify({ summary: result.choices?.[0]?.message?.content ?? "" }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
