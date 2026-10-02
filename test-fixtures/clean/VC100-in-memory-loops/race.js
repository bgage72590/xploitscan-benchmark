// Loops over in-memory arrays. Array.prototype.find is not a database call.
export function leader(racers) {
  let lead = 0;
  for (const r of racers) {
    if (r.isPlayer) continue;
    if (r.covered > lead) lead = r.covered;
  }
  return racers.find((r) => r.covered === lead);
}

export function scaled(cfg, keys, k) {
  const t = {};
  for (const key of keys) {
    const base = cfg[key];
    if (!isFinite(base)) throw new Error("CFG." + key + " is missing");
    t[key] = base * k;
  }
  return Object.keys(t).map((key) => t[key]).find((v) => v > 1);
}

export async function loadOnce(db) {
  // One query, outside any loop.
  const rows = await db.query("SELECT id, name FROM tracks");
  return rows.map((r) => r.name);
}
