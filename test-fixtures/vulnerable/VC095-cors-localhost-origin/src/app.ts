// Express API for the invoicing SaaS, deployed to Render. The CORS config
// was written against the Vite dev server and shipped unchanged: production
// still trusts http://localhost:5173 with credentials, so any process on a
// customer's machine that listens on that port can make cookie-authenticated
// requests to the live API and read the responses. VC095 must fire.

import express from "express";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import { invoicesRouter } from "./routes/invoices";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://app.invoicely.io"],
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
