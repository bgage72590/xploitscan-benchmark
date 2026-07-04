// Parameterized query where the SQL text lives in a variable — the variable
// indirection must NOT trip the VC006 taint layer because the user input is
// bound as a parameter, never concatenated into the SQL string.
const db = require("../models");

module.exports.userSearch = function (req, res) {
  const searchSql = "SELECT name,id FROM Users WHERE login = ?";
  db.sequelize.query(searchSql, { replacements: [req.body.login], model: db.User }).then((user) => {
    res.render("app/usersearch", { user: user });
  });
};
