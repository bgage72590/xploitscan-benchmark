import { getServerSession } from "next-auth";

// Same shape, but it establishes who is calling before doing anything.
export default async function handler(req, res) {
  const session = await getServerSession(req, res);
  if (!session) return res.status(401).json({ error: "unauthorized" });
  const row = await db.user.findUnique({ where: { id: session.user.id } });
  res.json(row);
}
