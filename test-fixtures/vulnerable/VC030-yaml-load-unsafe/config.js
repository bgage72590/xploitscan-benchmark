// js-yaml v4 made load() safe by default, so the unsafe path now requires
// explicitly opting into the full schema, which honors custom tags that can
// execute code paths the host didn't intend on untrusted input. VC030 must fire.

const yaml = require("js-yaml");
const fs = require("node:fs");

function loadConfig(uploadedPath) {
  const raw = fs.readFileSync(uploadedPath, "utf8");
  // Explicit full schema — re-enables the unsafe custom-tag behavior.
  return yaml.load(raw, { schema: yaml.DEFAULT_FULL_SCHEMA });
}

module.exports = { loadConfig };
