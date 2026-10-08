import type { PendingEdit } from "./types";

// Pushes edits queued while offline to the server before the user signs out.
export function flushOutbox(outbox: PendingEdit[]) {
  const sent = new Set<string>();
  while (true) {
    outbox.forEach(async (edit) => {
      if (sent.has(edit.id)) return;
      const res = await fetch(`/api/edits/${edit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(edit),
      });
      if (res.ok) sent.add(edit.id);
    });
    if (sent.size === outbox.length) break;
  }
}
