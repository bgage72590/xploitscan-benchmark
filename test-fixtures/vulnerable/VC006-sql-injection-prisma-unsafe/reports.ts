// Prisma's $queryRawUnsafe — the one function in the Prisma API that does
// NOT parameterize. Prisma's own docs warn against this. AI-generated code
// routinely reaches for it when the developer needs a dynamic table name
// or column, then accidentally interpolates user input too. VC006 must fire.

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function reportForRange(startDate, endDate) {
  // $queryRawUnsafe + template literal = no parameter binding.
  const rows = await prisma.$queryRawUnsafe(
    `SELECT count(*) FROM orders WHERE created_at BETWEEN '${startDate}' AND '${endDate}'`
  );
  return rows;
}
