import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { rateLimit } from "../middleware/rate-limit";
import { logger } from "../lib/logger";

const router = Router();

function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  return `${name.slice(0, 2)}***@${domain}`;
}

router.post("/login", rateLimit({ windowMs: 60_000, max: 5 }), async (req, res) => {
  const { email, password } = req.body;
  logger.info("Login attempt", { email: maskEmail(email) });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    logger.warn("Login failed: invalid email or password", { email: maskEmail(email) });
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  logger.info("Login success", { userId: user.id });

  res.cookie("session", token, { httpOnly: true, secure: true, sameSite: "lax" });
  return res.json({ id: user.id, email: user.email });
});

router.get("/me", async (req, res) => {
  const header = req.headers.authorization ?? "";
  const [, bearer] = header.split(" ");
  try {
    const payload = jwt.verify(bearer, process.env.JWT_SECRET!) as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    return res.json(user);
  } catch (err) {
    logger.warn("Token verification failed", { reason: (err as Error).name });
    return res.status(401).json({ error: "Unauthorized" });
  }
});

export default router;
