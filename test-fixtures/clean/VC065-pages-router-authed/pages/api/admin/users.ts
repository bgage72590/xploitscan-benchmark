import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

const ADMIN_KEY = process.env.ADMIN_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!ADMIN_KEY || req.headers["x-admin-key"] !== ADMIN_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }
  const users = await prisma.user.findMany();
  res.status(200).json(users);
}
