// A public catalogue read: products are meant to be seen by anyone. Reads
// only count when the table holds people or their money.
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const products = await prisma.product.findMany({ where: { published: true } });
  res.status(200).json(products);
}
