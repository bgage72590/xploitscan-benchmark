// Express API behind a plain load balancer that terminates TLS. helmet sets
// Strict-Transport-Security on every response (one year, subdomains
// included), so after the first visit browsers refuse to talk to the API over
// plain HTTP. VC087 must NOT fire.

import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ordersRouter } from "./routes/orders";
import { accountRouter } from "./routes/account";

const app = express();

app.set("trust proxy", 1);
app.use(
  helmet({
    strictTransportSecurity: { maxAge: 31536000, includeSubDomains: true },
  }),
);
app.use(cors({ origin: process.env.APP_ORIGIN, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.get("/healthz", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/orders", ordersRouter);
app.use("/api/account", accountRouter);

const port = Number(process.env.PORT ?? 8080);
app.listen(port, () => {
  console.log(`api listening on :${port}`);
});
