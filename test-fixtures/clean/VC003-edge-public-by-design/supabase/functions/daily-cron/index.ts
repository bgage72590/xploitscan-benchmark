// Invoked by the database scheduler, not by a browser. There is no caller
// session to check; whether the schedule invoker is itself locked down is a
// deployment question this file cannot answer, so the rule declines to judge.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const db = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  await db.from("daily_stats").insert({ ran_at: new Date().toISOString() });

  return new Response("ok");
});
