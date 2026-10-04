import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/api-auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const caller = await authorize(req, res);
  if (!caller) return;
  const orders = await prisma.order.findMany({ where: { ownerId: caller.id } });
  res.status(200).json(orders);
}
