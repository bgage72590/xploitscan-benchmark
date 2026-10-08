import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import winston from "winston";

// Ship API logs to Better Stack. Copied from the source's "Connect" page.
const logtail = new Logtail("zhHlY1dTr4aLBHn4cnvtaqUK", {
  endpoint: "https://s1290345.eu-nbg-2.betterstackdata.com",
});

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console(), new LogtailTransport(logtail)],
});

export async function flushLogs() {
  await logtail.flush();
}
