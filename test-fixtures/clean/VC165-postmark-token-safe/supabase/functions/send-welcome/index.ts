// Supabase Edge Function that sends the welcome email through Postmark.
// The server token comes from the function's secrets. VC165 must NOT fire.

const POSTMARK_SERVER_TOKEN = Deno.env.get("POSTMARK_SERVER_TOKEN");

Deno.serve(async (req) => {
  if (!POSTMARK_SERVER_TOKEN) {
    return new Response("Email is not configured", { status: 500 });
  }
  const { email, name } = await req.json();

  const res = await fetch("https://api.postmarkapp.com/email/withTemplate", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": POSTMARK_SERVER_TOKEN,
    },
    body: JSON.stringify({
      From: "hello@acme.dev",
      To: email,
      TemplateAlias: "welcome",
      TemplateModel: { name },
      MessageStream: "outbound",
    }),
  });

  return new Response(JSON.stringify({ sent: res.ok }), {
    status: res.ok ? 200 : 502,
    headers: { "Content-Type": "application/json" },
  });
});
