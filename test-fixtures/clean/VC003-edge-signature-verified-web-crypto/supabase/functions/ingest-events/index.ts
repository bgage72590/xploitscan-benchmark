// Signature-verified receiver, Deno style. Deno has no `node:crypto`
// createHmac in the idiomatic path — Web Crypto is how this is written — and
// the directory name gives no hint that this is a receiver.
const enc = new TextEncoder();

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

// The header is named `-digest` rather than `-signature` on purpose: this
// partner does not use the conventional name, so `HMAC` is the only token in
// the file that says "the caller is authenticated by a shared secret".
Deno.serve(async (req) => {
  const provided = req.headers.get("x-partner-digest") ?? "";
  const raw = await req.text();

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(Deno.env.get("PARTNER_SIGNING_KEY") ?? ""),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );

  const ok = await crypto.subtle.verify("HMAC", key, hexToBytes(provided), enc.encode(raw));
  if (!ok) return new Response("bad signature", { status: 400 });

  await persist(JSON.parse(raw));
  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});

async function persist(_payload: unknown) {}
