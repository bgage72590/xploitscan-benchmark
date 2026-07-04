// js-yaml with the safe schema (or the explicit safeLoad alias). Custom
// tags are rejected, so unexpected code paths can't be triggered by an
// attacker-supplied document. VC030 must NOT fire.

const yaml = require("js-yaml");
const fs = require("node:fs");

function loadConfig(uploadedPath) {
  const raw = fs.readFileSync(uploadedPath, "utf8");
  return yaml.load(raw, { schema: yaml.FAILSAFE_SCHEMA });
}

module.exports = { loadConfig };
