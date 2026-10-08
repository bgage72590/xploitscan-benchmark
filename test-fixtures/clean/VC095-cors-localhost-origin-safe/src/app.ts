// Express API for the invoicing SaaS, deployed to Render. Allowed origins
// come from the environment, so production lists only the real app domain
// and each developer's .env lists their own dev server. VC095 must NOT fire.

import express from "express";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import { invoicesRouter } from "./routes/invoices";

const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, httpOnly: true, sameSite: "none" },
  }),
);

app.use("/api/invoices", invoicesRouter);
