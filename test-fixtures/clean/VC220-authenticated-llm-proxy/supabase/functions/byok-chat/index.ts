// Bring your own key: the caller sends their own OpenAI key, so the bill is
// theirs. Not a denial-of-wallet risk for the app owner.
Deno.serve(async (req) => {
  const body = await req.json();
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${body.openaiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-4o-mini", messages: body.messages }),
  });
  return new Response(await r.text());
});
