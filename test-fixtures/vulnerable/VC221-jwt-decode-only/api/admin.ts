import express from "express";
import { jwtDecode } from "jwt-decode";

const router = express.Router();

router.delete("/users/:id", async (req, res) => {
  const payload = jwtDecode<{ role?: string }>(req.cookies.session);
  if (payload.role !== "admin") return res.status(403).end();
  await removeUser(req.params.id);
  res.status(204).end();
});

async function removeUser(_id: string) {}

export default router;
