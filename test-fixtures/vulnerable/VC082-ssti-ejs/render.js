// EJS rendering with a user-controlled template string. The attacker
// controls the template itself — pure SSTI, equivalent to RCE in EJS.
// VC082 must fire.

const ejs = require("ejs");

module.exports = function renderGreeting(req, res) {
  const userTemplate = req.body.template;
  const html = ejs.render(userTemplate, { name: req.user.name });
  res.send(html);
};
