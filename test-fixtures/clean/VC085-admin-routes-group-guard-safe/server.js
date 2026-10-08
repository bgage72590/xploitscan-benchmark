// Express API for the bookings app. Every route under /api/admin goes through
// verifyToken and verifyAdmin, mounted once on the prefix, so the admin routes
// below need no middleware of their own. VC085 must NOT fire.

const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { verifyToken, verifyAdmin } = require("./middleware/roles");
const ordersRouter = require("./routes/orders");

const prisma = new PrismaClient();
const app = express();

app.use(cors({ origin: process.env.APP_ORIGIN }));
app.use(express.json());

// Valid session token and the admin role, for the whole admin API.
app.use("/api/admin", verifyToken, verifyAdmin);

app.get("/api/admin/users", async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(users);
});

app.get("/api/admin/stats", async (req, res) => {
  const [users, bookings] = await Promise.all([prisma.user.count(), prisma.booking.count()]);
  res.json({ users, bookings });
});

app.use(ordersRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
