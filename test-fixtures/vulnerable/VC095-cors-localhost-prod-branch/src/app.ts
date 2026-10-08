// Express API for the invoicing SaaS. The non-development branch of the CORS
// setup also trusts http://localhost:3000 — added so the production build
// could be smoke-tested against a locally running frontend, and never
// removed. Production therefore accepts credentialed requests from any
// process listening on a customer's port 3000. VC095 must fire.
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { invoicesRouter } from "./routes/invoices";

const isDev = process.env.NODE_ENV === "development";

export const app = express();

if (isDev) app.use(morgan("dev"));
if (!isDev) {
  app.use(cors({ origin: ["https://app.invoicely.io", "http://localhost:3000"], credentials: true }));
  app.use(helmet());
} else {
  app.use(cors({ origin: true, credentials: true }));
}

app.use(express.json());
app.use("/api/invoices", invoicesRouter);
