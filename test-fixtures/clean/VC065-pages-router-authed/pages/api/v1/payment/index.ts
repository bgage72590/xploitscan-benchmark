import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import getTokenFromRequest from "@/lib/api/getTokenFromRequest";

// Shape of linkwarden's payment route: the caller check is a wrapper around
// next-auth's getToken that takes the request.
export default async function payment(req: NextApiRequest, res: NextApiResponse) {
  const token = await getTokenFromRequest(req);
  if (!token?.id) return res.status(404).json({ response: "Token invalid." });

  const user = await prisma.user.findUnique({ where: { id: token.id } });
  if (!user) return res.status(404).json({ response: "User not found." });
  return res.status(200).json({ email: user.email });
}
