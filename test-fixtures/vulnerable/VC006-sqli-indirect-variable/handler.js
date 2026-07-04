// SQL injection where the query string is built in a variable before the
// sink call — the regex layers can't see it; the AST taint layer must.
const db = require("../models");

module.exports.userSearch = function (req, res) {
  var searchSql = "SELECT name,id FROM Users WHERE login='" + req.body.login + "'";
  db.sequelize.query(searchSql, { model: db.User }).then((user) => {
    res.render("app/usersearch", { user: user });
  });
};
