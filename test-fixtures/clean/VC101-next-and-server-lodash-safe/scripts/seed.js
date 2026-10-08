// Seeds the local database with demo invoices: `node scripts/seed.js`
const { PrismaClient } = require("@prisma/client");
const moment = require("moment");
const { range } = require("lodash");

const prisma = new PrismaClient();

async function main() {
  const owner = await prisma.user.upsert({
    where: { email: "demo@acme.test" },
    update: {},
    create: { email: "demo@acme.test", name: "Demo User" },
  });
  for (const i of range(24)) {
    await prisma.invoice.create({
      data: {
        ownerId: owner.id,
        amount: 1000 + i * 50,
        issuedAt: moment().subtract(i, "months").toDate(),
      },
    });
  }
}

main().finally(() => prisma.$disconnect());
