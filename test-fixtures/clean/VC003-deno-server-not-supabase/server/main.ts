// A Deno HTTP bootstrap that is not a Supabase edge function and has no
// Supabase client anywhere near it. The advice "resolve the caller's token
// with supabase.auth.getUser()" does not apply to this file.
const routes = new Map<string, (req: Request) => Response>();

routes.set("/", () => new Response("dev server"));

Deno.serve({ port: 8000 }, (req) => {
  const path = new URL(req.url).pathname;
  const handler = routes.get(path);
  return handler ? handler(req) : new Response("not found", { status: 404 });
});
