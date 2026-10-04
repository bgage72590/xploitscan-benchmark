// A TanStack Start server route. `server.handlers` makes each method a plain
// HTTP endpoint; a route's beforeLoad guard does not run for it. This one
// hands any caller the Supabase admin auth API.
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/users")({
  server: {
    handlers: {
      DELETE: async ({ request }: { request: Request }) => {
        const { userId } = (await request.json()) as { userId: string };
        await supabaseAdmin.auth.admin.deleteUser(userId);
        return Response.json({ deleted: userId });
      },
    },
  },
});
