import { createClientFromRequest } from "npm:@base44/sdk@0.8.23";

// A public feed, named as one, that only reads.
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const posts = await base44.asServiceRole.entities.Post.filter({ visibility: "public" }, "-created_date", 20);
  return Response.json({ posts });
});
