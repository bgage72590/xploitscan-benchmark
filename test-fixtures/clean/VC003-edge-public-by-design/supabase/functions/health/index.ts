// A liveness probe. Authenticating it would defeat its purpose.
Deno.serve(() =>
  new Response(JSON.stringify({ ok: true, at: new Date().toISOString() }), {
    headers: { "Content-Type": "application/json" },
  })
);
