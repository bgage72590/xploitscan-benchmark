// Classic Time-of-Check-Time-of-Use: we stat the file to decide whether
// we're allowed to read it, then read it in a separate call. An attacker
// with local access can swap the symlink between the two operations.
// VC091 must fire.

const fs = require("node:fs");

function readIfSmall(filePath) {
  if (fs.existsSync(filePath) && fs.statSync(filePath).size < 1_000_000) {
    return fs.readFileSync(filePath, "utf8");
  }
  return null;
}

module.exports = { readIfSmall };
