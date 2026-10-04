// An anonymous poll vote: a Prisma `{ increment: 1 }` counter and nothing else.
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const option = await prisma.option.update({
    where: { id: String(req.body.optionId) },
    data: { votes: { increment: 1 } },
  });
  res.status(200).json(option);
}
