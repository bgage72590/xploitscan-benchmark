// EJS rendering with a STATIC template file. User data is passed only
// as context values, which EJS auto-escapes by default. VC082 must NOT
// fire.

const ejs = require("ejs");
const path = require("node:path");

module.exports = function renderGreeting(req, res) {
  ejs.renderFile(
    path.join(__dirname, "views", "greeting.ejs"),
    { name: req.user.name },
    (err, html) => {
      if (err) return res.status(500).send("render failed");
      res.send(html);
    },
  );
};
