// Express API for the bookings app. The admin route sits behind
// requireAdmin, which verifies the session token and the admin role on the
// server, and the env-dump debug route is gone — production config is checked
// in the Railway dashboard instead. VC085 must NOT fire.

const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { requireAdmin } = require("./middleware/requireAdmin");

const prisma = new PrismaClient();
const app = express();

app.use(cors({ origin: process.env.APP_ORIGIN }));
app.use(express.json());

app.get("/api/services", async (req, res) => {
  const services = await prisma.service.findMany({ where: { active: true } });
  res.json(services);
});

app.post("/api/bookings", async (req, res) => {
  const { serviceId, name, email, startsAt } = req.body;
  const booking = await prisma.booking.create({
    data: { serviceId, name, email, startsAt: new Date(startsAt) },
  });
  res.status(201).json(booking);
});

// Admin dashboard data
app.get("/admin/users", requireAdmin, async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, createdAt: true, _count: { select: { bookings: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(users);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
