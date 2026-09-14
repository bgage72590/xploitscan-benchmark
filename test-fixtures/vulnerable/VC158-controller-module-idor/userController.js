// Controller-module layout: handlers are exported bare and the routes are
// registered in a different file. Sequelize's legacy .find({ where }) API.
const db = require("../models");

exports.getInvoice = async function (req, res) {
  // IDOR: the invoice is looked up by an id the caller supplies, and the
  // query is scoped by nothing else. Any authenticated user can read any
  // invoice by changing the id.
  const invoice = await db.Invoice.find({
    where: {
      id: req.body.id,
    },
  });
  res.json(invoice);
};
