// The safe and the public-by-design TanStack Start shapes, pinned against the
// VC003 TanStack branch. Every one of these is either authenticated or is a
// write/read that is meant to work for a signed-out visitor.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Lovable's scaffolded auth middleware, scoped to the caller.
export const deleteOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ orderId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await context.supabase.from("orders").delete().eq("id", data.orderId).eq("owner_id", context.userId);
    return { ok: true };
  });

// A bespoke gate called inside the handler.
export const archiveOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ orderId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const admin = await requireAdminCaller();
    await supabaseAdmin.from("orders").update({ archived_by: admin.id }).eq("id", data.orderId);
    return { ok: true };
  });

// Public by design: a landing-page lead form only INSERTS.
export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ email: z.string().email() }).parse(input))
  .handler(async ({ data }) => {
    await supabaseAdmin.from("leads").insert({ email: data.email });
    return { ok: true };
  });

// Public by design: published content read through the admin client.
export const listNews = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await supabaseAdmin.from("news").select("slug,title").limit(50);
  return data ?? [];
});

// Public by design: a share link, where the unguessable token IS the
// credential, bumping its own view counter.
export const openSharedLap = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ token: z.string().min(16) }).parse(input))
  .handler(async ({ data }) => {
    const { data: share } = await supabaseAdmin.from("shared_laps").select("id, views").eq("token", data.token).single();
    if (!share) throw new Error("not found");
    await supabaseAdmin.from("shared_laps").update({ views: share.views + 1 }).eq("id", share.id);
    return share;
  });

// Anonymous analytics: only writes visitor/page-view tables.
export const heartbeatVisit = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ visitorId: z.string() }).parse(input))
  .handler(async ({ data }) => {
    await supabaseAdmin.from("visitor_sessions").upsert({ id: data.visitorId, last_seen: new Date().toISOString() });
    return { ok: true };
  });

async function requireAdminCaller() {
  return { id: "admin" };
}
