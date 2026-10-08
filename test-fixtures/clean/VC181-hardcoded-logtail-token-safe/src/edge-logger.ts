// Minimal logger for edge functions, where @logtail/node can't run.
const LOGTAIL_SOURCE_TOKEN = process.env.LOGTAIL_SOURCE_TOKEN;

export async function logEdge(level: "info" | "warn" | "error", message: string, meta = {}) {
  if (!LOGTAIL_SOURCE_TOKEN) return;
  await fetch(process.env.BETTER_STACK_INGESTING_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LOGTAIL_SOURCE_TOKEN}`,
    },
    body: JSON.stringify({ dt: new Date().toISOString(), level, message, ...meta }),
  });
}
