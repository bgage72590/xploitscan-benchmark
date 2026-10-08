import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import winston from "winston";

// Ship API logs to Better Stack. Token and ingesting host come from the
// deployment environment.
const logtail = new Logtail(process.env.BETTER_STACK_SOURCE_TOKEN!, {
  endpoint: process.env.BETTER_STACK_INGESTING_URL,
});

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console(), new LogtailTransport(logtail)],
});

export async function flushLogs() {
  await logtail.flush();
}
