export default {
  async fetch(request: Request, env: { OPENAI_API_KEY: string }) {
    const body = await request.json();
    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ model: "gpt-4o-mini", messages: body.messages }),
    });
    return new Response(upstream.body, { headers: { "content-type": "application/json" } });
  },
};
