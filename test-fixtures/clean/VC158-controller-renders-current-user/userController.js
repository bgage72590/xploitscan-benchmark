// The FP shape that matters: this handler DISPLAYS the current user, and its
// query is also properly scoped. Reading req.user for output must not be
// mistaken for authorization, and must not cause a false positive either.
const db = require("../models");

exports.getInvoice = async function (req, res) {
  const invoice = await db.Invoice.find({
    where: {
      id: req.body.id,
      userId: req.user.id,
    },
  });
  res.render("app/invoice", {
    userId: req.user.id,
    userEmail: req.user.email,
    invoice,
  });
};
