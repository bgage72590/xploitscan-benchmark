// A TanStack Start server function in the shape Lovable scaffolds since
// 2026-05-13. createServerFn compiles each one to a public RPC endpoint: the
// file lives in src/lib/, no route points at it, and anyone can POST to it.
// It deletes rows through the service-role client (which bypasses row-level
// security) using an id the caller chose, and nothing establishes a caller.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const deleteOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ orderId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("orders").delete().eq("id", data.orderId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// The caller-supplied `ownerId` is not an owner check: the caller picks it.
export const markOrderShipped = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ orderId: z.string().uuid(), ownerId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    await supabaseAdmin
      .from("orders")
      .update({ status: "shipped" })
      .eq("id", data.orderId)
      .eq("owner_id", data.ownerId);
    return { ok: true };
  });
