import { getServerSession } from "next-auth";

// Protected: resolves the session before touching data.
export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session) return new Response("Unauthorized", { status: 401 });
  return Response.json(await db.note.findMany({ where: { userId: session.user.id } }));
}

// NOT protected: deletes by a caller-supplied id with no session check at all.
// One protected sibling used to make this handler unreportable.
export async function DELETE(req: Request) {
  const { id } = await req.json();
  await db.note.delete({ where: { id } });
  return Response.json({ ok: true });
}
