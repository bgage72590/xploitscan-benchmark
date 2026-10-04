import { decodeJwt } from "jose";

// verify_jwt is on (the platform default): Supabase has already verified this
// JWT before the function runs.
Deno.serve((req) => {
  const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
  const claims = decodeJwt(token);
  return new Response(JSON.stringify({ sub: claims.sub }), {
    headers: { "Content-Type": "application/json" },
  });
});
