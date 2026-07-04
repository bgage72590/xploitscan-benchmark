// libxmljs parseXmlString with external entities enabled (noent:true) — XXE.
const libxmljs = require("libxmljs");
module.exports.importXml = function (req, res) {
  const tree = libxmljs.parseXmlString(req.body.xml, { noent: true });
  res.json({ root: tree.root().name() });
};
