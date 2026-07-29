// The routes the bootstrap mounts, each behind the auth middleware. Present so
// the fixture is a realistic project rather than a single orphan file.
import { Hono } from "hono";
import { requireAuth } from "./require-auth.js";

const app = new Hono();

app.get("/api/me", requireAuth, async (c) => {
  return c.json({ id: c.get("user").id });
});

export default app;
