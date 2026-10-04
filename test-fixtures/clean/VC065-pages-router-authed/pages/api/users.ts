// next-auth's Pages Router form: the session is checked before any query.
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/options";
import { db } from "../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });
  const me = await db.user.findUnique({ where: { email: session.user.email } });
  res.status(200).json(me);
}
