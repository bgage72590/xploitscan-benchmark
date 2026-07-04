// XML parsing with external entities fully disabled and DTD loading
// off. XXE not exploitable. VC081 must NOT fire.

const libxml = require("libxmljs2");

function parseFeed(xmlString) {
  const doc = libxml.parseXml(xmlString, {
    noent: false,
    dtdload: false,
    nonet: true,
  });
  return doc.root().toString();
}

module.exports = { parseFeed };
