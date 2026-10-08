// Supabase Edge Function that sends the welcome email through Postmark's
// REST API (the Node SDK doesn't run on Deno, so it calls fetch directly).
// The server token is written into the request headers.
// This should trigger VC165 (Hardcoded Postmark Server Token).

Deno.serve(async (req) => {
  const { email, name } = await req.json();

  const res = await fetch("https://api.postmarkapp.com/email/withTemplate", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": "00000000-0000-4000-8000-0000deadbeef",
    },
    body: JSON.stringify({
      From: "hello@acme.dev",
      To: email,
      TemplateAlias: "welcome",
      TemplateModel: { name },
      MessageStream: "outbound",
    }),
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: await res.text() }), { status: 502 });
  }
  return new Response(JSON.stringify({ sent: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
