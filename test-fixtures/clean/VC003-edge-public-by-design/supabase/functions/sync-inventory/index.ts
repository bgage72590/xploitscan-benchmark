// A signed webhook receiver whose name says nothing about webhooks. It
// authenticates its caller with an HMAC over the raw body — the correct
// mechanism for this kind of endpoint — so the rule must recognise the
// verification from the content and not from the directory name.
Deno.serve(async (req) => {
  const provided = req.headers.get("x-shopify-signature") ?? "";
  const raw = await req.text();

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(Deno.env.get("SHOPIFY_SIGNING_SECRET") ?? ""),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(raw));
  const expected = btoa(String.fromCharCode(...new Uint8Array(digest)));

  if (provided !== expected) {
    return new Response("bad signature", { status: 400 });
  }

  return new Response("ok");
});
