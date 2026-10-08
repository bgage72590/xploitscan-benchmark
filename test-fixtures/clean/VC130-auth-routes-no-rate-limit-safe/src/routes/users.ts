import { Router } from "express";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma";
import { signJwt } from "../utils/jwt";

// Mounted at /api (RealWorld "Conduit" API spec).
const router = Router();

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-7", legacyHeaders: false });

// POST /api/users/login
router.post("/users/login", loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body.user;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(422).json({ errors: { "email or password": ["is invalid"] } });
    }
    res.json({ user: { email: user.email, username: user.username, token: signJwt(user.id) } });
  } catch (err) {
    next(err);
  }
});

export default router;
