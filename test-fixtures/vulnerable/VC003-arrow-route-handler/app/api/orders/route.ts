// Next.js App Router handlers declared as exported arrow constants rather than
// named function declarations. Identical exposure to `export async function
// GET`, different syntax.
import { prisma } from "@/lib/prisma";

export const GET = async () => {
  const orders = await prisma.order.findMany();
  return Response.json(orders);
};

export const DELETE = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  await prisma.order.delete({ where: { id: searchParams.get("id") } });
  return Response.json({ ok: true });
};
