import { prisma } from "./db.js";

export async function ordersWithCustomers(orderIds) {
  const result = [];
  for (const id of orderIds) {
    const order = await prisma.order.findUnique({ where: { id } });
    result.push(order);
  }
  return result;
}
