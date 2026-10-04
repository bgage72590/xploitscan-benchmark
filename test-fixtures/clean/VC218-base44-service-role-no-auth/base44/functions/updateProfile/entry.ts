import { createClientFromRequest } from "npm:@base44/sdk@0.8.6";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // The glob below contains "/*". A comment masker that does not know about
    // strings reads it as the start of a block comment that runs to the end of
    // the comment further down, hiding the base44.auth.me() check in between
    // and turning this safe function into a critical "no caller check".
    const scope = new URL(req.url).searchParams.get("scope") ?? "/profile/*";

    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bio } = await req.json();
    /* Service role only after the caller is known, and only on their own record. */
    await base44.asServiceRole.entities.Profile.update(user.id, { bio });
    return Response.json({ ok: true, scope });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
});
