// Object.assign target <- untrusted body. If body contains __proto__
// nested objects (and the target has a nested chain), this pollutes
// Object.prototype via property copying. VC023 must fire.

function applySettings(req) {
  const target = { darkMode: false };
  Object.assign(target, req.body);
  return target;
}

module.exports = { applySettings };
