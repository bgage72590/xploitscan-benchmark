// next-auth/jwt getToken, and a wrapped export. The wrapper may BE the auth,
// so a default export that is not a function this file defines is never
// reported.
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { prisma } from "../../lib/prisma";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  if (!token) return res.status(401).end();
  await prisma.order.delete({ where: { id: String(req.query.id) } });
  res.status(204).end();
}

export default withRateLimit(handler);

function withRateLimit<T>(h: T): T {
  return h;
}
