// Tenant admin endpoint deep-merging req.body into a stored config.
// VC023 (proto pollution) — AST should catch via _.merge with tainted source.

const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.patch("/tenants/:id/config", async (req, res) => {
  const current = await db.getTenantConfig(req.params.id);
  const next = _.merge(current, req.body);
  await db.setTenantConfig(req.params.id, next);
  res.json(next);
});

module.exports = router;
