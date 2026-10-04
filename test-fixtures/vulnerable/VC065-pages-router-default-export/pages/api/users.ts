// The original Next.js API shape: a Pages Router file whose default export
// is the handler. It returns every user to anyone who requests the URL.
// Before the Pages Router branch, VC065 matched only App Router named
// exports, and this file got zero findings from all 214 rules.
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const users = await db.user.findMany();
  res.status(200).json(users);
}
