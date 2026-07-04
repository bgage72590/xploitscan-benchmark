// Handlebars.compile() on a user-supplied template string. SSTI — the
// attacker authors the template, not just the data. VC082 must fire.

const Handlebars = require("handlebars");

function renderWelcome(req) {
  const tpl = req.query.welcomeTemplate;
  const template = Handlebars.compile(tpl);
  return template({ user: req.user });
}

module.exports = { renderWelcome };
