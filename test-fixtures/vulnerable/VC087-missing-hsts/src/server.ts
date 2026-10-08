// Express API behind a plain load balancer that terminates TLS. No response
// tells browsers to stay on HTTPS, so a browser that is ever sent to
// http://api.example.com (a typed URL, an old link, a hostile Wi-Fi portal)
// talks plaintext first and can be downgraded and intercepted. VC087 must fire.

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ordersRouter } from "./routes/orders";
import { accountRouter } from "./routes/account";

const app = express();

app.set("trust proxy", 1);
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
