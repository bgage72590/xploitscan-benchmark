import pino from "pino";

// Structured logger: JSON output, level from the environment, and the
// password / authorization fields redacted if they ever reach a log call.
export const logger = pino({
  level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === "production" ? "info" : "debug"),
  redact: ["password", "*.password", "req.headers.authorization"],
});
