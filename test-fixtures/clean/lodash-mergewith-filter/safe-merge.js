// lodash.mergeWith with a customizer that drops polluting keys. Any
// __proto__ / constructor / prototype key in the source is rejected
// before it reaches the target. VC023 must NOT fire.

const _ = require("lodash");

const BLOCKED_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function safeMerge(target, source) {
  return _.mergeWith({}, target, source, (_objValue, _srcValue, key) => {
    if (BLOCKED_KEYS.has(key)) return undefined;
  });
}

module.exports = { safeMerge };
