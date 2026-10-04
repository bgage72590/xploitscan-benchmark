import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

Deno.serve(async (req: Request) => {
  try {
    const base44 = createClientFromRequest(req);
    // Every customer record, returned to whoever asks.
    const customers = await base44.asServiceRole.entities.Customer.list({ limit: 500 });
    return new Response(JSON.stringify(customers), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
  }
});
