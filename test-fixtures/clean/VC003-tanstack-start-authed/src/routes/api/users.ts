// A TanStack Start server route that resolves the caller from the bearer
// token and returns 401 without one.
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/users")({
  server: {
    handlers: {
      DELETE: async ({ request }: { request: Request }) => {
        const token = request.headers.get("authorization")?.replace("Bearer ", "") ?? "";
        const { data: claims } = await supabaseAdmin.auth.getClaims(token);
        if (!claims) return new Response("Unauthorized", { status: 401 });
        await supabaseAdmin.from("profiles").delete().eq("id", claims.claims.sub);
        return Response.json({ ok: true });
      },
    },
  },
});
