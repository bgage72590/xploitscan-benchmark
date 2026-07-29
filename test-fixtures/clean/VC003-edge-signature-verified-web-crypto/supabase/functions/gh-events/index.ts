// GitHub sends `X-Hub-Signature-256`, not `X-Hub-Signature`. A pattern that
// requires the quoted header literal to END at `-signature` reads straight
// past it.
import { verifyDelivery } from "../_shared/verify.ts";

Deno.serve(async (req) => {
  const provided = req.headers.get("X-Hub-Signature-256") ?? "";
  const raw = await req.text();

  if (!(await verifyDelivery(provided, raw))) {
    return new Response("bad signature", { status: 400 });
  }

  await handle(JSON.parse(raw));
  return new Response("ok");
});

async function handle(_payload: unknown) {}
