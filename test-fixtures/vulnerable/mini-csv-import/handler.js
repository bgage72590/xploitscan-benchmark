// CSV import handler. Two issues:
//   - VC025: req.body.path joined to import dir without boundary check
//   - VC042: parsed rows mass-assigned into User.bulkCreate

const fs = require("node:fs/promises");
const path = require("node:path");
const csv = require("csv-parse/sync");
const { User } = require("./model");

const IMPORT_DIR = "/app/imports";

async function importUsers(req, res) {
  const fullPath = path.join(IMPORT_DIR, req.body.path);
  const text = await fs.readFile(fullPath, "utf8");
  const rows = csv.parse(text, { columns: true });
  await User.bulkCreate(rows.map((r) => ({ ...r })));
  res.json({ inserted: rows.length });
}

module.exports = { importUsers };
