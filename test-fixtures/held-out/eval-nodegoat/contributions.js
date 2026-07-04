// Adapted from OWASP/NodeGoat app/routes/contributions.js (Apache-2.0). See NOTICE.
function ContributionsHandler () {
  this.handleContributionsUpdate = (req, res, next) => {
    const preTax = eval(req.body.preTax);
    const afterTax = eval(req.body.afterTax);
    const roth = eval(req.body.roth);
    return res.json({ preTax, afterTax, roth });
  };
}
module.exports = ContributionsHandler;
