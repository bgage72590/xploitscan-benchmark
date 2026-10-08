import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { rateLimit } from "../middleware/rate-limit";

const router = Router();

router.post("/login", rateLimit({ windowMs: 60_000, max: 5 }), async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", { email, password });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  console.log(`Login success for ${email}, issued token ${token}`);

  res.cookie("session", token, { httpOnly: true, secure: true, sameSite: "lax" });
  return res.json({ id: user.id, email: user.email });
});

router.get("/me", async (req, res) => {
  console.log("Auth header received:", req.headers.authorization);
  const header = req.headers.authorization ?? "";
  const [, bearer] = header.split(" ");
  try {
    const payload = jwt.verify(bearer, process.env.JWT_SECRET!) as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    return res.json(user);
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

export default router;
