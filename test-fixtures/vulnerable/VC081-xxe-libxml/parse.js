// libxml2 parser configured to resolve external entities on untrusted
// XML. Classic XXE — attacker can exfiltrate files via SYSTEM entities.
// VC081 must fire.

const libxml = require("libxmljs2");

function parseFeed(xmlString) {
  const doc = libxml.parseXml(xmlString, {
    noent: true,
    dtdload: true,
  });
  return doc.root().toString();
}

module.exports = { parseFeed };
