// The explicit form: resolve the caller from the bearer token, reject when
// there isn't one, and scope the write to that user.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";

  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  const body = await req.json();
  await admin.from("notes").insert({ body: body.text, user_id: user.id });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
