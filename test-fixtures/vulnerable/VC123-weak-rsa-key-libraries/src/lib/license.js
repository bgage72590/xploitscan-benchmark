const fs = require("fs");
const path = require("path");
const NodeRSA = require("node-rsa");

const KEY_PATH = path.join(__dirname, "..", "..", "keys", "license.pem");

// Signs the offline license keys the desktop app verifies.
function loadSigningKey() {
  if (fs.existsSync(KEY_PATH)) {
    return new NodeRSA(fs.readFileSync(KEY_PATH, "utf8"));
  }
  const key = new NodeRSA({ b: 512 });
  fs.writeFileSync(KEY_PATH, key.exportKey("pkcs8-private-pem"), { mode: 0o600 });
  return key;
}

function signLicense(payload) {
  return loadSigningKey().sign(JSON.stringify(payload), "base64");
}

module.exports = { signLicense };
