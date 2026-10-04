import { jwtVerify } from "jose";

export default {
  async fetch(request: Request, env: { OPENAI_API_KEY: string; JWT_KEY: string }) {
    const auth = request.headers.get("Authorization");
    if (!auth) return new Response("Unauthorized", { status: 401 });
    await jwtVerify(auth.slice(7), new TextEncoder().encode(env.JWT_KEY));
    const body = await request.json();
    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: "gpt-4o-mini", messages: body.messages }),
    });
    return new Response(upstream.body);
  },
};
