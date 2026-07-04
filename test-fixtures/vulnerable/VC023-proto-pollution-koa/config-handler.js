// Koa handler merging ctx.request.body into a target object. Tests the
// AST taint tracker's ctx.request.* two-hop path recognition. VC023 must fire.

const _ = require("lodash");

module.exports = async function updateConfig(ctx) {
  const defaults = { theme: "light", retries: 3 };
  ctx.body = _.merge(defaults, ctx.request.body);
};
