import { createClientFromRequest } from "npm:@base44/sdk@0.8.6";

// Called by a scheduler, which sends a shared secret.
Deno.serve(async (req) => {
  if (req.headers.get("x-cron-secret") !== Deno.env.get("DIGEST_CRON_SECRET")) {
    return new Response("forbidden", { status: 403 });
  }
  const base44 = createClientFromRequest(req);
  const users = await base44.asServiceRole.entities.User.filter({ digest_opt_in: true });
  for (const user of users) {
    await base44.asServiceRole.integrations.Core.SendEmail({ to: user.email, subject: "Your digest", body: "..." });
  }
  return Response.json({ sent: users.length });
});
