// Prisma's $queryRaw with the Prisma.sql tagged template IS parameterized
// under the hood — every ${...} interpolation becomes a bound parameter,
// not a string concatenation. This is the safe counterpart to
// $queryRawUnsafe. VC006 must not fire.

import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export async function reportForRange(startDate: Date, endDate: Date) {
  // Tagged template form — Prisma binds ${startDate} and ${endDate} as
  // prepared-statement parameters. No injection possible.
  const rows = await prisma.$queryRaw(
    Prisma.sql`SELECT count(*) FROM orders WHERE created_at BETWEEN ${startDate} AND ${endDate}`
  );
  return rows;
}
