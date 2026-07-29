// The same gap in the newer `Deno.serve` form, on a destructive operation:
// anyone who can reach the function URL can delete any row by id.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const { itemId } = await req.json();

  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  await admin.from("items").delete().eq("id", itemId);

  return new Response(JSON.stringify({ deleted: itemId }), {
    headers: { "Content-Type": "application/json" },
  });
});
