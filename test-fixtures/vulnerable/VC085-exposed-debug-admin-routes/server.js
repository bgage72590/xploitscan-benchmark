// Express API for the bookings app. Two "temporary" routes added while
// debugging the Railway deploy were never removed, and neither checks who is
// calling: /debug dumps process.env (database URL, Stripe secret key) and
// /admin/users lists every customer with their bookings. VC085 must fire.

const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(cors());
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

// Quick check that the env vars made it into the container
app.get("/debug", (req, res) => {
  res.json({
    env: process.env,
    node: process.version,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// Admin dashboard data
app.get("/admin/users", async (req, res) => {
  const users = await prisma.user.findMany({
    include: { bookings: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(users);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
