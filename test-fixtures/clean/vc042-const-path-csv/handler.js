// CSV import from a FIXED server-side path (a constant, not user input).
// The taint-preserving fs-read + csv.parse chain must not *originate* taint,
// so even though the parsed rows are spread into bulkCreate, VC042 must NOT
// fire — the data never came from a tainted source.
const fs = require("node:fs/promises");
const csv = require("csv-parse/sync");
const { User } = require("./model");

const SEED_FILE = "/app/seed/users.csv";

async function importSeed(req, res) {
  const text = await fs.readFile(SEED_FILE, "utf8");
  const rows = csv.parse(text, { columns: true });
  await User.bulkCreate(rows.map((r) => ({ ...r })));
  res.json({ inserted: rows.length });
}

module.exports = { importSeed };
