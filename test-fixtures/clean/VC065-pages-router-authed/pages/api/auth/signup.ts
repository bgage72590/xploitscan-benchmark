// An auth flow: a signed-out caller must reach it.
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const existing = await prisma.user.findUnique({ where: { email: req.body.email } });
  if (existing) return res.status(409).end();
  await prisma.user.update({ where: { email: req.body.email }, data: { invited: true } });
  res.status(201).end();
}
