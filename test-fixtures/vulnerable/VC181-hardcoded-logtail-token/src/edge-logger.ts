// Minimal logger for edge functions, where @logtail/node can't run.
const LOGTAIL_SOURCE_TOKEN = "Qm7dR2kVx9LcTn4pWb8sHf3J";

export async function logEdge(level: "info" | "warn" | "error", message: string, meta = {}) {
  await fetch("https://s1290345.eu-nbg-2.betterstackdata.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LOGTAIL_SOURCE_TOKEN}`,
    },
    body: JSON.stringify({ dt: new Date().toISOString(), level, message, ...meta }),
  });
}
