// Deep-merging an untrusted object into a target with lodash.merge is
// the canonical prototype pollution sink: keys like "__proto__" or
// "constructor.prototype" pollute Object.prototype. VC023 must fire.

const _ = require("lodash");

function updateConfig(req) {
  const defaults = { theme: "light", retries: 3 };
  return _.merge(defaults, req.body);
}

module.exports = { updateConfig };
