// Koa handler using mergeWith with a __proto__/constructor/prototype filter.
// Safe against prototype pollution. VC023 must NOT fire.

const _ = require("lodash");

const BLOCKED = new Set(["__proto__", "constructor", "prototype"]);

module.exports = async function updateConfig(ctx) {
  const defaults = { theme: "light", retries: 3 };
  ctx.body = _.mergeWith({}, defaults, ctx.request.body, (_obj, _src, key) => {
    if (BLOCKED.has(key)) return undefined;
  });
};
