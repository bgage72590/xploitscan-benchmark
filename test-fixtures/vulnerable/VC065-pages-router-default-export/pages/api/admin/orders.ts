// The same gap with the handler declared first and exported by name, on a
// destructive operation: anyone can delete any order by id.
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  await prisma.order.delete({ where: { id: String(id) } });
  res.status(204).end();
};

export default handler;
